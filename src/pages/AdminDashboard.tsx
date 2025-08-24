import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Stats {
  users: number;
  courses: number;
  enrollments: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<Stats>('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-chess-darker text-white">
      <Navbar />
      <div className="pt-32 pb-20">
        <Container>
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gold">Quick Stats</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card h-32 animate-pulse rounded-xl"></div>
                <div className="glass-card h-32 animate-pulse rounded-xl"></div>
                <div className="glass-card h-32 animate-pulse rounded-xl"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card p-6 text-center">
                  <div className="text-4xl font-bold text-white">{stats?.users}</div>
                  <p className="text-white/70 mt-2">Total Users</p>
                </Card>
                <Card className="glass-card p-6 text-center">
                  <div className="text-4xl font-bold text-white">{stats?.courses}</div>
                  <p className="text-white/70 mt-2">Total Courses</p>
                </Card>
                <Card className="glass-card p-6 text-center">
                  <div className="text-4xl font-bold text-white">{stats?.enrollments}</div>
                  <p className="text-white/70 mt-2">Total Enrollments</p>
                </Card>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gold">Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/admin/courses">
                <Card className="glass-card p-6 text-center hover:border-gold/50 border-transparent border-2 transition-colors">
                  <h3 className="text-xl font-bold">Manage Courses</h3>
                  <p className="text-white/70 mt-2">Add, edit, or delete courses and their lessons.</p>
                </Card>
              </Link>
               <Link to="/admin/users">
                <Card className="glass-card p-6 text-center hover:border-gold/50 border-transparent border-2 transition-colors">
                  <h3 className="text-xl font-bold">Manage Users</h3>
                  <p className="text-white/70 mt-2">View and manage user roles and information.</p>
                </Card>
              </Link>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;