"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Wallet, FileText, Calendar, CheckCircle, XCircle, Clock, ArrowLeft, Upload, Eye } from "lucide-react";
import { useEffect } from "react";
import { fetchProjects, applyProject, uploadMilestone } from "@/lib/api";

interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "completed" | "in-progress" | "upcoming" | "overdue";
  documents?: File[];
  submissionDate?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdDate?: string;
  milestones: Milestone[];
}

export default function ProducerDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    { 
      id: "1", 
      name: "Organic Vegetable Farm Expansion", 
      description: "Expanding organic vegetable production with sustainable farming practices", 
      status: "Approved",
      createdDate: "2025-01-15",
      milestones: [
        {
          id: "m1",
          title: "Land Preparation",
          description: "Clear and prepare 5 acres of land for organic farming",
          deadline: "2025-03-15",
          status: "completed",
          submissionDate: "2025-03-10"
        },
        {
          id: "m2",
          title: "Infrastructure Setup",
          description: "Install irrigation systems and organic farming equipment",
          deadline: "2025-04-30",
          status: "in-progress"
        },
        {
          id: "m3",
          title: "Crop Planting",
          description: "Plant seasonal vegetables and implement crop rotation",
          deadline: "2025-06-15",
          status: "upcoming"
        }
      ]
    },
    { 
      id: "2", 
      name: "Solar Greenhouse Initiative", 
      description: "Installing solar-powered greenhouse systems for year-round production", 
      status: "Pending",
      createdDate: "2025-02-10",
      milestones: [
        {
          id: "m4",
          title: "Site Survey",
          description: "Conduct feasibility study and site assessment",
          deadline: "2025-02-28",
          status: "overdue"
        },
        {
          id: "m5",
          title: "Permit Acquisition",
          description: "Obtain necessary construction and environmental permits",
          deadline: "2025-04-01",
          status: "upcoming"
        }
      ]
    },
    { 
      id: "3", 
      name: "Dairy Farm Modernization", 
      description: "Upgrading dairy equipment and implementing animal welfare improvements", 
      status: "Rejected",
      createdDate: "2025-01-28",
      milestones: []
    },
    { 
      id: "4", 
      name: "Sustainable Crop Rotation", 
      description: "Implementing advanced crop rotation techniques", 
      status: "Approved",
      createdDate: "2025-02-05",
      milestones: [
        {
          id: "m6",
          title: "Soil Analysis",
          description: "Complete comprehensive soil testing",
          deadline: "2025-03-20",
          status: "in-progress"
        }
      ]
    }
  ]);

  useEffect(() => {
  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };
  loadProjects();
}, []);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    documents: null as File | null,
  });

  const [milestoneUpload, setMilestoneUpload] = useState({
    projectId: "",
    milestoneId: "",
    files: null as File | null,
    notes: ""
  });

  const [showSubsidyForm, setShowSubsidyForm] = useState(false);
  const [showMilestoneUpload, setShowMilestoneUpload] = useState(false);

  const handleConnectWallet = () => {
    console.log("Connect Wallet clicked");
  };

 const handleApplySubsidy = async () => {
  try {
    const formData = new FormData();
    formData.append("name", newProject.name);
    formData.append("description", newProject.description);
    if (newProject.documents) formData.append("documents", newProject.documents);

    const createdProject = await applyProject(formData);
    setProjects(prev => [...prev, createdProject]);
    setNewProject({ name: "", description: "", documents: null });
    setShowSubsidyForm(false);
  } catch (err) {
    console.error("Failed to apply project:", err);
  }
};

  const handleMilestoneUpload = async () => {
  try {
    const formData = new FormData();
    if (milestoneUpload.files) formData.append("file", milestoneUpload.files);
    formData.append("milestoneId", milestoneUpload.milestoneId);

    const updatedMilestone = await uploadMilestone(
      milestoneUpload.projectId,
      milestoneUpload.milestoneId,
      formData
    );

    setProjects(prev =>
      prev.map(project =>
        project.id === milestoneUpload.projectId
          ? {
              ...project,
              milestones: project.milestones.map(m =>
                m.id === milestoneUpload.milestoneId ? updatedMilestone : m
              )
            }
          : project
      )
    );

    setMilestoneUpload({ projectId: "", milestoneId: "", files: null, notes: "" });
    setShowMilestoneUpload(false);
  } catch (err) {
    console.error("Failed to upload milestone:", err);
  }
};



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-100 border-green-200";
      case "in-progress":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "upcoming":
        return "text-gray-700 bg-gray-100 border-gray-200";
      case "overdue":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-700 bg-green-100 border-green-200";
      case "Rejected":
        return "text-red-700 bg-red-100 border-red-200";
      case "Pending":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const filteredProjects = projects.filter(project => {
  const name = project.name?.toLowerCase() || "";
  const description = project.description?.toLowerCase() || "";
  const status = project.status?.toLowerCase() || "";
  const term = searchTerm?.toLowerCase() || "";

  return name.includes(term) || description.includes(term) || status.includes(term);
});

  // Stats calculations
  const totalProjects = projects.length;
  const approvedProjects = projects.filter(p => p.status === "Approved").length;
  const pendingProjects = projects.filter(p => p.status === "Pending").length;
  const totalMilestones = projects.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = projects.reduce((acc, p) => 
    acc + p.milestones.filter(m => m.status === "completed").length, 0
  );

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProject(null)}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-green-800">{selectedProject.name}</h1>
              <p className="text-green-600 mt-1">{selectedProject.description}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-2 ${getStatusColor(selectedProject.status)}`}>
              {getStatusIcon(selectedProject.status)}
              {selectedProject.status}
            </div>
          </div>

          {/* Milestones */}
          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Project Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedProject.milestones.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-600">No milestones defined for this project yet.</p>
                </div>
              ) : (
                selectedProject.milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-800">{milestone.title}</h3>
                        <p className="text-green-700 text-sm mt-1">{milestone.description}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMilestoneStatusColor(milestone.status)}`}>
                        {milestone.status.replace('-', ' ')}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-green-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                        {milestone.submissionDate && (
                          <span className="ml-4">
                            • Submitted: {new Date(milestone.submissionDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {milestone.status !== "completed" && selectedProject.status === "Approved" && (
                        <Button 
                          size="sm" 
                          onClick={() => {
                            setMilestoneUpload({ 
                              projectId: selectedProject.id, 
                              milestoneId: milestone.id, 
                              files: null, 
                              notes: "" 
                            });
                            setShowMilestoneUpload(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Milestone Upload Modal */}
          {showMilestoneUpload && (
            <Card className="border-green-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="text-green-800 flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Submit Milestone Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800">
                    {selectedProject.milestones.find(m => m.id === milestoneUpload.milestoneId)?.title}
                  </h4>
                  <p className="text-green-700 text-sm">
                    {selectedProject.milestones.find(m => m.id === milestoneUpload.milestoneId)?.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-green-700 font-medium">Upload Documents</Label>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setMilestoneUpload({
                        ...milestoneUpload,
                        files: e.target.files?.[0] || null
                      })
                    }
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <p className="text-xs text-green-600">Supported formats: PDF, DOC, DOCX, JPG, PNG</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-green-700 font-medium">Submission Notes</Label>
                  <Textarea
                    value={milestoneUpload.notes}
                    onChange={(e) =>
                      setMilestoneUpload({ ...milestoneUpload, notes: e.target.value })
                    }
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                    placeholder="Add any notes about your milestone completion..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleMilestoneUpload}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Submit Milestone
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowMilestoneUpload(false)}
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Producer Dashboard
            </h1>
            <p className="text-green-600 mt-2">Manage your agricultural projects and subsidies</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowSubsidyForm(!showSubsidyForm)} 
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Apply for Subsidy
            </Button>
            <Button 
              onClick={handleConnectWallet}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{totalProjects}</div>
              <div className="text-green-600 text-xs">Total Projects</div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{approvedProjects}</div>
              <div className="text-green-600 text-xs">Approved</div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{pendingProjects}</div>
              <div className="text-green-600 text-xs">Pending</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{totalMilestones}</div>
              <div className="text-green-600 text-xs">Total Milestones</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-800">{completedMilestones}</div>
              <div className="text-green-600 text-xs">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-200 bg-white/80"
          />
        </div>

        {/* Subsidy Application Form */}
        {showSubsidyForm && (
          <Card className="border-green-200 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-green-800 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Apply for Agricultural Subsidy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-green-700 font-medium">Project Name</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                    placeholder="Enter project name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-green-700 font-medium">Supporting Documents</Label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        documents: e.target.files?.[0] || null,
                      })
                    }
                    className="border-green-200 focus:border-green-400 focus:ring-green-200"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-green-700 font-medium">Project Description</Label>
                <Textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({ ...newProject, description: e.target.value })
                  }
                  className="border-green-200 focus:border-green-400 focus:ring-green-200 min-h-[120px]"
                  placeholder="Provide detailed information about your project, expected outcomes, and how it will benefit agricultural productivity..."
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleApplySubsidy}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit Application
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSubsidyForm(false)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-green-800">Your Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="border-green-200 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-green-800 text-base leading-tight">{project.name}</CardTitle>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      {project.status}
                    </div>
                  </div>
                  {project.createdDate && (
                    <div className="flex items-center text-green-600 text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(project.createdDate).toLocaleDateString()}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-green-700 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                  
                  {/* Milestone Progress */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-green-700">Milestones</span>
                      <span className="text-xs text-green-600">
                        {project.milestones.filter(m => m.status === "completed").length}/{project.milestones.length}
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: project.milestones.length === 0 ? '0%' : 
                            `${(project.milestones.filter(m => m.status === "completed").length / project.milestones.length) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedProject(project)}
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <Card className="border-green-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">No projects found</h3>
                <p className="text-green-600 mb-4">
                  {searchTerm ? `No projects match "${searchTerm}"` : "You haven't applied for any subsidies yet."}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => setShowSubsidyForm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for Your First Subsidy
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}