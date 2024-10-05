import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../utils/supabaseClient'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import Navbar from '../../components/Navbar'
import Loader from '../../components/Loader'
import { Plus, Edit, Trash2, Calendar, ArrowLeft } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog'
import { useToast } from "../../hooks/use-toast"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import AttendanceRecord from '../../components/AttendanceRecord'
import Link from 'next/link'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Label } from '../../components/ui/label'
import Breadcrumbs from '../../components/Breadcrumbs'

interface Class {
    id: string
    name: string
    description: string
}

interface Student {
    id: string
    name: string
    email: string
}

interface Attendance {
    id: string
    student_id: string
    date: string
    status: boolean | null  // Changed to allow null for unmarked
}

interface UpdatedAttendance {
    id: string;
    student_id: string;
    date: string;
    status: boolean | null;
}

export default function ClassPage() {
    const [classData, setClassData] = useState<Class | null>(null)
    const [students, setStudents] = useState<Student[]>([])
    const [newStudentName, setNewStudentName] = useState('')
    const [newStudentEmail, setNewStudentEmail] = useState('')
    const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [attendanceData, setAttendanceData] = useState<Attendance[]>([])
    const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
    const router = useRouter()
    const { id } = router.query
    const { toast } = useToast()
    const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        if (id) {
            fetchClassData()
            fetchStudents()
        }
    }, [id])

    useEffect(() => {
        if (id && students.length > 0) {
            fetchAttendance()
        }
    }, [id, students, selectedDate])

    const fetchClassData = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('classes')
            .select('*')
            .eq('id', id)
            .single()
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch class data. Please try again.",
            })
        } else {
            setClassData(data)
        }
        setIsLoading(false)
    }

    const fetchStudents = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('class_id', id)
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch students. Please try again.",
            })
        } else {
            setStudents(data || [])
        }
        setIsLoading(false)
    }

    const addStudent = async () => {
        const { data, error } = await supabase
            .from('students')
            .insert([{ name: newStudentName, email: newStudentEmail, class_id: id }])
            .select()
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add student. Please try again.",
            })
        } else {
            setStudents([...students, data[0]])
            setNewStudentName('')
            setNewStudentEmail('')
            setIsAddStudentDialogOpen(false)
            toast({
                variant: "success",
                title: "Success",
                description: "Student added successfully.",
            })
        }
    }

    const deleteStudent = async () => {
        if (!deleteStudentId) return
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', deleteStudentId)
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete student. Please try again.",
            })
        } else {
            setStudents(students.filter(s => s.id !== deleteStudentId))
            toast({
                variant: "success",
                title: "Success",
                description: "Student deleted successfully.",
            })
        }
        setDeleteStudentId(null)
        setIsDeleteDialogOpen(false)
    }

    const fetchAttendance = async () => {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('class_id', id)
            .eq('date', format(selectedDate, 'yyyy-MM-dd'))

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch attendance data. Please try again.",
            })
        } else {
            // Initialize attendance data for all students, with no status set
            const fullAttendanceData = students.map(student => ({
                id: '',
                student_id: student.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                status: null // Use null to represent unmarked attendance
            }))

            // Update with existing attendance data
            data.forEach(record => {
                const index = fullAttendanceData.findIndex(a => a.student_id === record.student_id)
                if (index !== -1) {
                    fullAttendanceData[index] = record
                }
            })

            setAttendanceData(fullAttendanceData)
        }
    }

    const toggleAttendance = async (studentId: string, status: boolean | null) => {
        const existingRecord = attendanceData.find(a => a.student_id === studentId)
        
        try {
            let updatedRecord: UpdatedAttendance | null = null;
            if (existingRecord && existingRecord.id) {
                // Update existing record
                if (status === null) {
                    // If setting to null (unmarked), delete the record
                    const { error } = await supabase
                        .from('attendance')
                        .delete()
                        .eq('id', existingRecord.id)

                    if (error) throw error
                } else {
                    // Update the status
                    const { data, error } = await supabase
                        .from('attendance')
                        .update({ status: status })
                        .eq('id', existingRecord.id)
                        .select()

                    if (error) throw error
                    if (data) {
                        updatedRecord = data[0] as UpdatedAttendance;
                    }
                }
            } else if (status !== null) {
                // Create new record only if status is not null
                const { data, error } = await supabase
                    .from('attendance')
                    .insert({
                        class_id: id,
                        student_id: studentId,
                        date: format(selectedDate, 'yyyy-MM-dd'),
                        status: status
                    })
                    .select()

                if (error) throw error
                if (data) {
                    updatedRecord = data[0] as UpdatedAttendance;
                }
            }

            // Update local state immediately
            setAttendanceData(prevData => {
                if (updatedRecord === null) {
                    return prevData.filter(a => a.student_id !== studentId);
                } else {
                    return prevData.map(a => 
                        a.student_id === studentId ? { ...a, ...updatedRecord } : a
                    );
                }
            });

        } catch (error) {
            console.error('Error updating attendance:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update attendance. Please try again.",
            })
        }
    }

    const renderCalendar = () => {
        const start = startOfMonth(selectedDate)
        const end = endOfMonth(selectedDate)
        const days = eachDayOfInterval({ start, end })

        return (
            <div className="w-full max-w-sm mx-auto">
                <div className="mb-4 text-lg font-semibold text-center">
                    {format(selectedDate, 'MMMM yyyy')}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                        <Button
                            key={day.toString()}
                            variant={isSameDay(day, selectedDate) ? "default" : "outline"}
                            className={`h-8 w-8 p-0 ${index === 0 && `col-start-${day.getDay() + 1}`}`}
                            onClick={() => setSelectedDate(day)}
                        >
                            <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                        </Button>
                    ))}
                </div>
            </div>
        )
    }

    const renderAttendanceList = () => {
        const isAnyAttendanceMarked = attendanceData.some(a => a.status !== null)

        return (
            <div className="space-y-4 overflow-y-auto max-h-[400px]">
                {students.map((student) => {
                    const attendance = attendanceData.find(a => a.student_id === student.id)
                    return (
                        <div key={student.id} className="flex items-center justify-between p-4 bg-card rounded-md">
                            <span className="font-medium">{student.name}</span>
                            <RadioGroup
                                onValueChange={(value) => {
                                    if (value === 'unmarked') {
                                        toggleAttendance(student.id, null)
                                    } else {
                                        toggleAttendance(student.id, value === 'present')
                                    }
                                }}
                                value={attendance?.status === null ? 'unmarked' : (attendance?.status ? 'present' : 'absent')}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="present" id={`present-${student.id}`} />
                                    <Label htmlFor={`present-${student.id}`}>Present</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="absent" id={`absent-${student.id}`} />
                                    <Label htmlFor={`absent-${student.id}`}>Absent</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="unmarked" id={`unmarked-${student.id}`} />
                                    <Label htmlFor={`unmarked-${student.id}`}>Unmarked</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )
                })}
                {!isAnyAttendanceMarked && (
                    <p className="text-center text-muted-foreground mt-4">
                        No attendance marked yet. Mark attendance to count this as a class day.
                    </p>
                )}
            </div>
        )
    }

    if (isLoading) return <Loader />

    if (!classData) return <div>No class data found.</div>

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto p-8">
                <Breadcrumbs items={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: classData?.name || 'Class', href: `/class/${id}` }
                ]} />
                <Button 
                    variant="outline" 
                    onClick={() => router.back()} 
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-4xl font-bold mb-4 text-primary">{classData?.name}</h1>
                <p className="text-xl text-muted-foreground mb-8">{classData?.description}</p>
                <Card className="bg-card text-card-foreground mb-8">
                    <CardHeader>
                        <CardTitle className="text-primary">Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-1/3">
                                {renderCalendar()}
                            </div>
                            <div className="w-full lg:w-2/3">
                                <h3 className="text-lg font-semibold mb-4">
                                    Attendance for {format(selectedDate, 'MMMM d, yyyy')}
                                </h3>
                                {renderAttendanceList()}
                            </div>
                        </div>
                        <div className="mt-8">
                            <Link href={`/attendance-record/${id}`}>
                                <Button>View Detailed Attendance Record</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card text-card-foreground mb-8">
                    <CardHeader>
                        <CardTitle className="text-primary">Today's Attendance Record</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AttendanceRecord 
                            classId={id as string} 
                            date={format(selectedDate, 'yyyy-MM-dd')} 
                            attendanceData={attendanceData.map(a => ({ ...a, status: a.status || false }))}
                        />
                    </CardContent>
                </Card>

                <Card className="bg-card text-card-foreground">
                    <CardHeader>
                        <CardTitle className="text-primary">Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="mb-4">
                                    <Plus className="w-4 h-4 mr-2" /> Add Student
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Student</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <Input
                                        placeholder="Student Name"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Student Email"
                                        value={newStudentEmail}
                                        onChange={(e) => setNewStudentEmail(e.target.value)}
                                    />
                                    <Button onClick={addStudent}>Add Student</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-primary/20">
                                        <th className="text-left py-2 px-4 text-primary">Name</th>
                                        <th className="text-left py-2 px-4 text-primary">Email</th>
                                        <th className="text-right py-2 px-4 text-primary">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id} className="border-b border-primary/10">
                                            <td className="py-2 px-4">{student.name}</td>
                                            <td className="py-2 px-4">{student.email}</td>
                                            <td className="text-right py-2 px-4">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    onClick={() => {
                                                        setDeleteStudentId(student.id)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this student? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={deleteStudent}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}