// src/pages/Admin.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FirestoreService from '@/firebase/firestoreService';
const { getDocuments } = FirestoreService;
import { Download, Calendar, Users, Mail, Heart } from 'lucide-react';
import * as XLSX from 'xlsx';

interface RSVPEntry {
  id: string;
  name: string;
  email: string;
  guests: number;
  attendance: boolean;
  guestDetails?: Array<{
    id: number;
    name: string;
    preference: "veg" | "nonveg" | "";
  }>;
  message?: string;
  timestamp: string;
}

const AdminPage = () => {
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate vegetarian and non-vegetarian counts
  const vegCount = rsvpEntries.reduce((count, entry) => {
    if (entry.guestDetails) {
      return count + entry.guestDetails.filter(guest => guest.preference === "veg").length;
    }
    return count;
  }, 0);

  const nonVegCount = rsvpEntries.reduce((count, entry) => {
    if (entry.guestDetails) {
      return count + entry.guestDetails.filter(guest => guest.preference === "nonveg").length;
    }
    return count;
  }, 0);

  useEffect(() => {
    fetchRSVPData();
  }, []);

  const fetchRSVPData = async () => {
    try {
      setLoading(true);
      const data = await getDocuments('rsvps');
      // Sort by timestamp in descending order (newest first)
      const sortedData = data.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRsvpEntries(sortedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching RSVP data:', err);
      setError('Failed to fetch RSVP data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (rsvpEntries.length === 0) return;

    // Prepare data for export with each guest in separate rows
    const exportData = [];
    
    rsvpEntries.forEach(entry => {
      if (entry.guestDetails && entry.guestDetails.length > 0) {
        // For entries with multiple guests, create a row for each guest
        entry.guestDetails.forEach((guest, index) => {
          exportData.push({
            'ID': index === 0 ? entry.id.substring(0, 8) : '', // Show ID only for first guest
            'Timestamp': index === 0 ? new Date(entry.timestamp).toLocaleString() : '', // Show timestamp only for first guest
            'Guest Name': guest.name,
            'Attendance': entry.attendance ? 'Attending' : 'Not Attending',
            'Food Preference': guest.preference === 'veg' 
              ? 'Vegetarian' 
              : guest.preference === 'nonveg' 
                ? 'Non-Vegetarian' 
                : 'Not Specified'
          });
        });
      } else {
        // For entries with no guest details, create a single row
        exportData.push({
          'ID': entry.id.substring(0, 8),
          'Timestamp': new Date(entry.timestamp).toLocaleString(),
          'Guest Name': entry.name,
          'Attendance': entry.attendance ? 'Attending' : 'Not Attending',
          'Food Preference': 'Not Specified'
        });
      }
      
      // Add empty row for spacing between entries
      exportData.push({});
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Adjust column widths
    ws['!cols'] = [
      { wch: 15 }, // ID
      { wch: 20 }, // Timestamp
      { wch: 25 }, // Guest Name
      { wch: 15 }, // Attendance
      { wch: 20 }  // Food Preference
    ];
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVP Entries');
    
    // Download the file
    XLSX.writeFile(wb, `rsvp_entries_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <CardTitle className="text-2xl">RSVP Administration</CardTitle>
            </div>
            <p className="text-muted-foreground">
              Manage and download RSVP entries for the celebration
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchRSVPData} variant="outline" disabled={loading}>
              Refresh Data
            </Button>
            <Button 
              onClick={downloadExcel} 
              disabled={loading || rsvpEntries.length === 0}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading RSVP entries...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Guest Names</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Food Preferences</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvpEntries.length > 0 ? (
                    rsvpEntries.flatMap((entry, entryIndex) => [
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {entry.guestDetails && entry.guestDetails.length > 0 
                              ? entry.guestDetails.map(g => g.name).join(', ')
                              : entry.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={entry.attendance ? "default" : "destructive"}
                            className="capitalize"
                          >
                            {entry.attendance ? 'Attending' : 'Not Attending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.guestDetails && entry.guestDetails.length > 0 ? (
                            <div className="text-sm space-y-1">
                              {entry.guestDetails.map((guest, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className="font-medium">{guest.name}:</span>
                                  <Badge 
                                    variant={guest.preference === "veg" ? "default" : "secondary"}
                                    className={guest.preference === "veg" 
                                      ? "bg-green-100 text-green-800" 
                                      : guest.preference === "nonveg" 
                                        ? "bg-orange-100 text-orange-800" 
                                        : "bg-gray-100 text-gray-800"}
                                  >
                                    {guest.preference === "veg" 
                                      ? "Vegetarian" 
                                      : guest.preference === "nonveg" 
                                        ? "Non-Vegetarian" 
                                        : "Not Specified"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Badge variant="secondary">Not Specified</Badge>
                          )}
                        </TableCell>
                      </TableRow>,
                      // Add spacing row after each entry
                      <TableRow key={`${entry.id}-spacer`}>
                        <TableCell colSpan={5} className="h-4 p-0 bg-muted/10"></TableCell>
                      </TableRow>
                    ])
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No RSVP entries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rsvpEntries.length}</div>
              <p className="text-sm text-muted-foreground">Total RSVPs received</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {rsvpEntries.filter(entry => entry.attendance).length}
              </div>
              <p className="text-sm text-muted-foreground">Confirmed attendees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Veg Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{vegCount}</div>
              <p className="text-sm text-muted-foreground">Vegetarian meals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Non-Veg Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{nonVegCount}</div>
              <p className="text-sm text-muted-foreground">Non-vegetarian meals</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPage;