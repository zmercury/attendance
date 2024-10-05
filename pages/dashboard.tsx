import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../components/ui/dialog"
import { useToast } from "../hooks/use-toast"
import { motion } from 'framer-motion'
import Breadcrumbs from '../components/Breadcrumbs'

interface Class {
    id: string
    name: string
    description: string
    studentCount: number
    totalClassDays: number
}

export default function Dashboard() {
    const [classes, setClasses] = useState<Class[]>([])
    const [newClassName, setNewClassName] = useState('')
    const [newClassDescription, setNewClassDescription] = useState('')
    const [editingClass, setEditingClass] = useState<Class | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [deleteClassId, setDeleteClassId] = useState<string | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        fetchClasses()
    }, [])

    const fetchClasses = async () => {
        setIsLoading(true)
        const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select('*')

        if (classesError) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch classes. Please try again.",
            })
        } else {
            const classesWithDetails = await Promise.all(classesData.map(async (cls) => {
                const { count: studentCount } = await supabase
                    .from('students')
                    .select('id', { count: 'exact', head: true })
                    .eq('class_id', cls.id)

                const { data: attendanceData, error: attendanceError } = await supabase
                    .from('attendance')
                    .select('date')
                    .eq('class_id', cls.id)

                if (attendanceError) {
                    console.error('Error fetching attendance dates:', attendanceError)
                    return { ...cls, studentCount: studentCount || 0, totalClassDays: 0 }
                }

                // Count unique dates
                const uniqueDates = new Set(attendanceData.map(record => record.date))
                const totalClassDays = uniqueDates.size

                return { ...cls, studentCount: studentCount || 0, totalClassDays }
            }))

            setClasses(classesWithDetails)
        }
        setIsLoading(false)
    }

    const createClass = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "You must be logged in to create a class.",
            })
            return
        }

        const { data, error } = await supabase
            .from('classes')
            .insert([{
                name: newClassName,
                description: newClassDescription,
                teacher_id: user.id
            }])
            .select()
        if (error) {
            console.error('Error creating class:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: `Failed to create class: ${error.message}`,
            })
        } else {
            setClasses([...classes, data[0]])
            setNewClassName('')
            setNewClassDescription('')
            setIsCreateDialogOpen(false)  // Close the dialog
            toast({
                variant: "success",
                title: "Success",
                description: "Class created successfully.",
            })
        }
    }

    const updateClass = async () => {
        if (!editingClass) return
        const { error } = await supabase
            .from('classes')
            .update({ name: newClassName, description: newClassDescription })
            .eq('id', editingClass.id)
        if (error) {
            console.error('Error updating class:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update class. Please try again.",
            })
        } else {
            setClasses(classes.map(c => c.id === editingClass.id ? { ...c, name: newClassName, description: newClassDescription } : c))
            setEditingClass(null)
            setNewClassName('')
            setNewClassDescription('')
            setIsEditDialogOpen(false)  // Close the dialog
            toast({
                variant: "success",
                title: "Success",
                description: "Class updated successfully.",
            })
        }
    }

    const deleteClass = async () => {
        if (!deleteClassId) return
        const { error } = await supabase
            .from('classes')
            .delete()
            .eq('id', deleteClassId)
        if (error) {
            console.error('Error deleting class:', error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete class. Please try again.",
            })
        } else {
            setClasses(classes.filter(c => c.id !== deleteClassId))
            toast({
                variant: "success",
                title: "Success",
                description: "Class deleted successfully.",
            })
        }
        setDeleteClassId(null)
        setIsDeleteDialogOpen(false)
    }

    if (isLoading) return <Loader />

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto p-8">
                <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }]} />
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">Your Classes</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Class</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <Input
                                    placeholder="Class Name"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                />
                                <Input
                                    placeholder="Class Description"
                                    value={newClassDescription}
                                    onChange={(e) => setNewClassDescription(e.target.value)}
                                />
                                <Button onClick={createClass}>Create Class</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((cls, index) => (
                        <motion.div
                            key={cls.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-all duration-300 bg-card border border-primary/20">
                                <CardHeader>
                                    <CardTitle className="text-primary">{cls.name}</CardTitle>
                                    <CardDescription>{cls.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-muted-foreground">
                                            <Users className="w-4 h-4 mr-2" />
                                            <span>{cls.studentCount} Students</span>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>{cls.totalClassDays} Class Days</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <Button variant="outline" onClick={() => router.push(`/class/${cls.id}`)}>
                                            View Class
                                        </Button>
                                        <div className="space-x-2">
                                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setEditingClass(cls)
                                                        setNewClassName(cls.name)
                                                        setNewClassDescription(cls.description)
                                                    }}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Class</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 mt-4">
                                                        <Input
                                                            placeholder="Class Name"
                                                            value={newClassName}
                                                            onChange={(e) => setNewClassName(e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Class Description"
                                                            value={newClassDescription}
                                                            onChange={(e) => setNewClassDescription(e.target.value)}
                                                        />
                                                        <Button onClick={updateClass}>Update Class</Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => {
                                                    setDeleteClassId(cls.id)
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this class? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={deleteClass}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}