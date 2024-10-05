import React from 'react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface AttendanceRecordProps {
    classId: string;
    date: string;
    attendanceData: {
        status: boolean;
    }[];
}

const AttendanceRecord: React.FC<AttendanceRecordProps> = ({ classId, date, attendanceData }) => {
    const present = attendanceData.filter(record => record.status).length;
    const absent = attendanceData.length - present;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>{format(new Date(date), 'MMMM d, yyyy')}</TableCell>
                    <TableCell>{present}</TableCell>
                    <TableCell>{absent}</TableCell>
                    <TableCell>{attendanceData.length}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default AttendanceRecord;