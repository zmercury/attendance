import React from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Image from 'next/image';
import { CheckCircle, Users, Calendar, ChartBar } from 'lucide-react';
import Footer from '../components/Footer';

const DocsPage = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-5xl font-bold mb-8 text-primary text-center py-10">Attendance Management System Documentation</h1>

                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-primary">What Our Program Does</h2>
                    <p className="text-lg mb-6">
                        Our Attendance Management System is designed to streamline the process of tracking and managing student attendance in educational institutions. It offers a user-friendly interface for teachers and administrators to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: <CheckCircle className="w-6 h-6 text-primary" />, title: "Easy Attendance Tracking", description: "Mark attendance with just a few clicks" },
                            { icon: <Users className="w-6 h-6 text-primary" />, title: "Student Management", description: "Add, edit, or remove students from classes" },
                            { icon: <Calendar className="w-6 h-6 text-primary" />, title: "Calendar Integration", description: "View attendance on an intuitive calendar interface" },
                            { icon: <ChartBar className="w-6 h-6 text-primary" />, title: "Detailed Reports", description: "Generate comprehensive attendance reports" },
                        ].map((feature, index) => (
                            <Card key={index} className="bg-card hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg font-semibold">
                                        {feature.icon}
                                        <span className="ml-2">{feature.title}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4 text-primary">Technologies Used</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[
                            { name: "Next.js", logo: "/nextjs-icon.png" },
                            { name: "React", logo: "/nextjs-icon.png" },
                            { name: "Tailwind CSS", logo: "/nextjs-icon.png" },
                            { name: "Shadcn UI", logo: "/nextjs-icon.png" },
                            { name: "TypeScript", logo: "/nextjs-icon.png" },
                            { name: "Supabase", logo: "/nextjs-icon.png" },
                            { name: "Framer Motion", logo: "/nextjs-icon.png" },
                            { name: "Chakra UI", logo: "/nextjs-icon.png" },
                        ].map((tech) => (
                            <Card key={tech.name} className="flex flex-col items-center justify-center p-4 hover:shadow-lg transition-shadow duration-300">
                                {/* <Image src={tech.logo} alt={`${tech.name} logo`} width={64} height={64} className="mb-2" /> */}
                                <p className="text-center font-semibold">{tech.name}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Sign up for an account or log in if you already have one.</li>
                            <li>Once logged in, you'll be directed to the dashboard where you can manage your classes.</li>
                        </ol>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Managing Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            <li>To create a new class, click on the "Create New Class" button on the dashboard.</li>
                            <li>Enter the class name and description, then click "Create Class".</li>
                            <li>To view or edit a class, click on the "View Class" button for the respective class.</li>
                            <li>You can edit or delete a class using the icons next to each class on the dashboard.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Managing Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            <li>In the class view, you can see a list of all students in that class.</li>
                            <li>To add a new student, click on the "Add Student" button and fill in the required information.</li>
                            <li>To remove a student, click on the delete icon next to the student's name.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Taking Attendance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            <li>In the class view, you'll see a calendar where you can select a date to take or view attendance.</li>
                            <li>For each student, you can mark them as Present, Absent, or leave it Unmarked.</li>
                            <li>The attendance status is automatically saved as you make changes.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Viewing Attendance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            <li>To view detailed attendance records, click on the "View Detailed Attendance Record" button in the class view.</li>
                            <li>Here, you can see attendance statistics for each student over time.</li>
                            <li>Use the year and month selectors to view records for specific periods.</li>
                            <li>Click on "View Details" for any student to see their individual attendance chart and statistics.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tips and Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Regularly update attendance to maintain accurate records.</li>
                            <li>Use the detailed attendance view to identify students who may need additional support.</li>
                            <li>Ensure all student information is up-to-date for accurate record-keeping.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default DocsPage;