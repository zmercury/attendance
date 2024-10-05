import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Users, Calendar, ChartBar } from 'lucide-react';

const features = [
    {
        icon: <CheckCircle className="h-6 w-6 text-primary" />,
        title: 'Easy Attendance Tracking',
        description: 'Mark attendance with just a few clicks. Simple and efficient.'
    },
    {
        icon: <Users className="h-6 w-6 text-primary" />,
        title: 'Student Management',
        description: 'Easily add, edit, or remove students from your classes.'
    },
    {
        icon: <Calendar className="h-6 w-6 text-primary" />,
        title: 'Calendar Integration',
        description: 'View and manage attendance on a user-friendly calendar interface.'
    },
    {
        icon: <ChartBar className="h-6 w-6 text-primary" />,
        title: 'Detailed Reports',
        description: 'Generate comprehensive attendance reports for better insights.'
    }
];

const Functionalities: React.FC = () => {
    return (
        <section className="py-16 bg-background/95">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-primary">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
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
            </div>
        </section>
    );
};

export default Functionalities;