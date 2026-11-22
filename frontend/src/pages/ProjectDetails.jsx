
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  ClipboardList,
  Clock3,
  Trash2,
  X,
  Activity,
  RefreshCw,
  UserRound,
  CalendarDays,
  FolderKanban,
  Users,
  UserPlus,
  Crown,
  UserMinus,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import "./ProjectDetails.css";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const getStatusClass = (status) => {
  switch (status) {
    case "Open":
      return "status-open";
    case "In Progress":
      return "status-in-progress";
    case "Resolved":
    case "Closed":
      return "status-done";
    default:
      return "status-open";
  }
};

const getPriorityTextClass = (priority) => {
  switch (priority) {
    case "Low":
      return "priority-text-low";
    case "Medium":
      return "priority-text-medium";
    case "High":
    case "Critical":
      return "priority-text-high";
    default:
      return "priority-text-medium";
  }
};

const getPriorityMarkClass = (priority) => {
  switch (priority) {
    case "Low":
      return "priority-low";
    case "Medium":
      return "priority-medium";
    case "High":
    case "Critical":
      return "priority-high";
    default:
      return "priority-medium";
  }
};

const getId = (value) => {
  if (!value) return "";
  return String(value._id || value.id || value);
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [members, setMembers] = useState([]);
  const [owner, setOwner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [newIssue, setNewIssue] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const [activityIssue, setActivityIssue] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const [memberUsername, setMemberUsername] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [removingMemberId, setRemovingMemberId] = useState("");

  const currentUserId = getId(user);
  const ownerId = getId(owner || project?.owner);

  const isOwner =
    currentUserId !== "" &&
    ownerId !== "" &&
    currentUserId === ownerId;

  // LOAD PROJECT, ISSUES AND MEMBERS
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [projectResponse, issueResponse, memberResponse] =
        await Promise.all([
          api.get("/projects"),
          api.get(`/issues/project/${id}`),
          api.get(`/projects/${id}/members`),
        ]);

      const projectList = Array.isArray(projectResponse.data)
        ? projectResponse.data
        : projectResponse.data?.projects || [];

      const foundProject = projectList.find(
        (item) => String(item._id) === String(id)
      );

      if (!foundProject) {
        setProject(null);
        setIssues([]);
        setMembers([]);
        setOwner(null);
        setError("Project not found or you do not have access.");
        return;
      }

      setProject(foundProject);

      const issueList = Array.isArray(issueResponse.data)
        ? issueResponse.data
        : issueResponse.data?.issues || [];

      setIssues(issueList);

      const memberData = memberResponse.data?.members || [];
      const ownerData = memberResponse.data?.owner || foundProject.owner;

      setMembers(memberData);
      setOwner(ownerData);
    } catch (err) {
      console.error("Project details loading failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load project details."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // CLEAR MESSAGES
  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // OPEN CREATE ISSUE MODAL
  const openCreateForm = () => {
    clearMessages();
    setCreateError("");
    setShowCreateForm(true);
  };

  // CLOSE CREATE ISSUE MODAL
  const closeCreateForm = () => {
    if (creating) return;

    setShowCreateForm(false);
    setCreateError("");
  };

  // CLOSE MODALS WITH ESCAPE
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showCreateForm && !creating) {
          closeCreateForm();
        }

        if (activityIssue) {
          closeActivity();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showCreateForm, creating, activityIssue]);

  // ADD PROJECT MEMBER
  const addMember = async (e) => {
    e.preventDefault();

    const username = memberUsername.trim().toLowerCase();

    if (!username) {
      setError("Enter a username.");
      return;
    }

    clearMessages();
    setAddingMember(true);

    try {
      const response = await api.post(`/projects/${id}/members`, {
        username,
      });

      setMemberUsername("");
      setSuccess(response.data?.message || "Member added successfully.");

      await loadData(true);
    } catch (err) {
      console.error("Add member failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to add member."
      );
    } finally {
      setAddingMember(false);
    }
  };

  // REMOVE PROJECT MEMBER
  const removeMember = async (member) => {
    const memberId = getId(member);

    if (!memberId) return;

    if (
      !window.confirm(
        `Remove @${member.username || member.name} from this project?`
      )
    ) {
      return;
    }

    clearMessages();
    setRemovingMemberId(memberId);

    try {
      await api.delete(
        `/projects/${id}/members/${memberId}`
      );

      setSuccess("Member removed successfully.");

      await loadData(true);
    } catch (err) {
      console.error("Remove member failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to remove member."
      );
    } finally {
      setRemovingMemberId("");
    }
  };

  // CREATE ISSUE
  const createIssue = async (e) => {
    e.preventDefault();

    const title = newIssue.title.trim();

    if (!title) {
      setCreateError("Please enter an issue title.");
      return;
    }

    clearMessages();
    setCreateError("");
    setCreating(true);

    try {
      await api.post("/issues", {
        title,
        description: newIssue.description.trim(),
        priority: newIssue.priority,
        projectId: id,
      });

      setNewIssue({
        title: "",
        description: "",
        priority: "Medium",
      });

      setShowCreateForm(false);
      setSuccess("Issue created successfully.");

      await loadData(true);
    } catch (err) {
      console.error("Create issue failed:", err);

      setCreateError(
        err.response?.data?.message ||
          "Unable to create issue."
      );
    } finally {
      setCreating(false);
    }
  };

  // UPDATE ISSUE STATUS
  const updateIssueStatus = async (issueId, status) => {
    clearMessages();

    try {
      await api.put(`/issues/${issueId}`, { status });

      setSuccess("Issue status updated successfully.");
      await loadData(true);
    } catch (err) {
      console.error("Status update failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update issue status."
      );
    }
  };

  // UPDATE ISSUE PRIORITY
  const updateIssuePriority = async (issueId, priority) => {
    clearMessages();

    try {
      await api.put(`/issues/${issueId}`, { priority });

      setSuccess("Issue priority updated successfully.");
      await loadData(true);
    } catch (err) {
      console.error("Priority update failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update issue priority."
      );
    }
  };

  // ASSIGN / UNASSIGN ISSUE
  const assignIssue = async (issueId, assigneeId) => {
    clearMessages();

    try {
      await api.put(`/issues/${issueId}/assign`, {
        assigneeId: assigneeId || null,
      });

      setSuccess(
        assigneeId
          ? "Issue assigned successfully."
          : "Issue unassigned successfully."
      );

      await loadData(true);
    } catch (err) {
      console.error("Assignment failed:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      setError(
        err.response?.data?.message ||
          `Assignment failed (${err.response?.status || err.message}).`
      );
    }
  };

  // DELETE ISSUE
  const deleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) {
      return;
    }

    clearMessages();

    try {
      await api.delete(`/issues/${issueId}`);

      setSuccess("Issue deleted successfully.");
      await loadData(true);
    } catch (err) {
      console.error("Delete issue failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete issue."
      );
    }
  };

  // OPEN ISSUE ACTIVITY
  const openActivity = async (issue) => {
    setActivityIssue(issue);
    setActivities([]);
    setActivityLoading(true);
    clearMessages();

    try {
      const response = await api.get(
        `/issues/${issue._id}/activity`
      );

      setActivities(response.data?.activities || []);
    } catch (err) {
      console.error("Activity loading failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load issue activity."
      );
    } finally {
      setActivityLoading(false);
    }
  };

  // CLOSE ACTIVITY
  const closeActivity = () => {
    setActivityIssue(null);
    setActivities([]);
  };

  // PROJECT ASSIGNEES: OWNER + MEMBERS ONLY
  const projectUsers = useMemo(() => {
    const allUsers = [owner, ...members].filter(Boolean);
    const uniqueUsers = new Map();

    allUsers.forEach((person) => {
      const personId = getId(person);
      if (personId) uniqueUsers.set(personId, person);
    });

    return Array.from(uniqueUsers.values());
  }, [owner, members]);

  // FILTER ISSUES
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        issue.title?.toLowerCase().includes(searchText) ||
        issue.description?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        issue.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [issues, search, statusFilter, priorityFilter]);

  // ISSUE STATISTICS
  const stats = useMemo(() => {
    const total = issues.length;

    const open = issues.filter(
      (issue) => issue.status === "Open"
    ).length;

    const progress = issues.filter(
      (issue) => issue.status === "In Progress"
    ).length;

    const resolved = issues.filter(
      (issue) =>
        issue.status === "Resolved" ||
        issue.status === "Closed"
    ).length;

    return {
      total,
      open,
      progress,
      resolved,
      completion: total === 0
        ? 0
        : Math.round((resolved / total) * 100),
    };
  }, [issues]);

  // LOADING
  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-loading">
          <RefreshCw size={25} className="pd-spinner" />
          <p>Loading project workspace...</p>
        </div>
      </div>
    );
  }

  // PROJECT NOT FOUND
  if (!project) {
    return (
      <div className="pd-page">
        <div className="pd-not-found">
          <FolderKanban size={42} />
          <h2>Project unavailable</h2>
          <p>{error || "Project could not be found."}</p>

          <Link to="/projects">
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pd-page">

      {/* BACK */}
      <Link to="/projects" className="pd-back">
        <ArrowLeft size={15} />
        Back to Projects
      </Link>

      {/* PROJECT HERO */}
      <section className="pd-hero">
        <div className="pd-hero-top">
          <div className="pd-project-symbol">
            <FolderKanban size={23} />
          </div>

          <span className="pd-project-label">
            PROJECT WORKSPACE
          </span>
        </div>

        <h2>{project.name}</h2>

        <p>
          {project.description ||
            "Manage issues, assignments, and project progress."}
        </p>

        <div className="pd-hero-bottom">
          <div className="pd-hero-meta">
            <span>
              <ClipboardList size={14} />
              {stats.total} Issues
            </span>

            <span>
              <CalendarDays size={14} />
              {project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "Project"}
            </span>

            <span>
              <Users size={14} />
              {members.length + 1} Members
            </span>
          </div>

          <Button onClick={openCreateForm}>
            <Plus size={16} />
            New Issue
          </Button>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="pd-error">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              style={{
                border: "none",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div
          className="pd-error"
          style={{
            color: "#4338ca",
            background: "#eef2ff",
            borderColor: "#c7d2fe",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              style={{
                border: "none",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TEAM MEMBERS */}
      <section className="pd-create-panel">
        <div className="pd-panel-heading">
          <div>
            <h3>
              <Users size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
              Team Members
            </h3>
            <p>Manage who can access this project.</p>
          </div>
        </div>

        {/* ADD MEMBER - OWNER ONLY */}
        {isOwner && (
          <form
            className="pd-create-form"
            onSubmit={addMember}
          >
            <label>
              Add member by username

              <Input
                value={memberUsername}
                onChange={(e) => setMemberUsername(e.target.value)}
                placeholder="Enter username (e.g. testuser)"
                required
              />
            </label>

            <div className="pd-form-actions">
              <Button type="submit" disabled={addingMember}>
                <UserPlus size={16} />
                {addingMember ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </form>
        )}

        {/* OWNER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 0",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Crown size={18} color="#d97706" />

            <div>
              <strong>{owner?.name || project.owner?.name || "Project Owner"}</strong>

              <div style={{ fontSize: 12, color: "#64748b" }}>
                @{owner?.username || project.owner?.username || "owner"}
              </div>
            </div>
          </div>

          <span
            style={{
              fontSize: 11,
              padding: "4px 9px",
              borderRadius: 20,
              background: "#fef3c7",
              color: "#92400e",
              fontWeight: 700,
            }}
          >
            OWNER
          </span>
        </div>

        {/* MEMBERS */}
        {members.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: 13, paddingTop: 12 }}>
            No team members yet. Add users by their unique username.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={getId(member)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 0",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <UserRound size={18} color="#64748b" />

                <div>
                  <strong>{member.name}</strong>

                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    @{member.username}
                  </div>
                </div>
              </div>

              {isOwner && (
                <Button
                  type="button"
                  onClick={() => removeMember(member)}
                  disabled={removingMemberId === getId(member)}
                >
                  <UserMinus size={15} />
                  {removingMemberId === getId(member)
                    ? "Removing..."
                    : "Remove"}
                </Button>
              )}
            </div>
          ))
        )}
      </section>

      {/* STATISTICS */}
      <section className="pd-stats">
        <div className="pd-stat">
          <div className="pd-stat-icon pd-stat-indigo">
            <ClipboardList size={20} />
          </div>

          <div>
            <small>Total Issues</small>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="pd-stat">
          <div className="pd-stat-icon pd-stat-cyan">
            <Clock3 size={20} />
          </div>

          <div>
            <small>Open Issues</small>
            <strong>{stats.open}</strong>
          </div>
        </div>

        <div className="pd-stat">
          <div className="pd-stat-icon pd-stat-indigo">
            <Activity size={20} />
          </div>

          <div>
            <small>In Progress</small>
            <strong>{stats.progress}</strong>
          </div>
        </div>

        <div className="pd-stat pd-progress-stat">
          <small>Resolution Progress</small>
          <strong>{stats.completion}%</strong>

          <div className="pd-progress-track">
            <div style={{ width: `${stats.completion}%` }} />
          </div>
        </div>
      </section>

      {/* ISSUES SECTION */}
      <section className="pd-issues-section">
        <div className="pd-issues-heading">
          <div>
            <h3>Issues</h3>
            <p>Track, assign, and manage project work.</p>
          </div>

          <span className="pd-issue-count">
            {filteredIssues.length} Issues
          </span>
        </div>

        {/* FILTERS */}
        <div className="pd-filters">
          <div className="pd-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>

            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>

            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <Button
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? "pd-spinner" : ""} />
          </Button>
        </div>

        {/* ISSUE LIST */}
        <div className="pd-issue-list">
          {filteredIssues.length === 0 ? (
            <div className="pd-empty">
              <ClipboardList size={40} />

              <h3>No issues found</h3>

              <p>
                {issues.length === 0
                  ? "Create your first issue to get started."
                  : "Try changing your search or filters."}
              </p>

              {issues.length === 0 && (
                <Button onClick={openCreateForm}>
                  <Plus size={16} />
                  Create Issue
                </Button>
              )}
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <article className="pd-issue-card" key={issue._id}>
                {/* ISSUE INFORMATION */}
                <div className="pd-issue-main">
                  <div
                    className={`pd-priority-mark ${getPriorityMarkClass(
                      issue.priority
                    )}`}
                  />

                  <div className="pd-issue-info">
                    <h4>{issue.title}</h4>

                    <p>
                      {issue.description || "No description provided."}
                    </p>

                    <div className="pd-issue-meta">
                      <span className={`pd-status ${getStatusClass(issue.status)}`}>
                        {issue.status}
                      </span>

                      <span
                        className={`pd-priority ${getPriorityTextClass(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>

                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 10,
                          color: "#64748b",
                        }}
                      >
                        <UserRound size={13} />

                        {issue.assignee?.username
                          ? `@${issue.assignee.username}`
                          : issue.assignee?.name ||
                            issue.assignee?.email ||
                            "Unassigned"}
                      </span>

                      {issue.createdAt && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "#94a3b8",
                          }}
                        >
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ISSUE CONTROLS */}
                <div className="pd-issue-controls">
                  <select
                    aria-label="Issue status"
                    value={issue.status || "Open"}
                    onChange={(e) =>
                      updateIssueStatus(issue._id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Issue priority"
                    value={issue.priority || "Medium"}
                    onChange={(e) =>
                      updateIssuePriority(issue._id, e.target.value)
                    }
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Assign issue"
                    value={getId(issue.assignee)}
                    onChange={(e) =>
                      assignIssue(issue._id, e.target.value)
                    }
                  >
                    <option value="">Unassigned</option>

                    {projectUsers.map((person) => (
                      <option key={getId(person)} value={getId(person)}>
                        {person.username
                          ? `@${person.username}`
                          : person.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    title="View activity"
                    aria-label="View activity"
                    onClick={() => openActivity(issue)}
                  >
                    <Activity size={16} />
                  </button>

                  <button
                    type="button"
                    title="Delete issue"
                    aria-label="Delete issue"
                    onClick={() => deleteIssue(issue._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* CREATE ISSUE MODAL */}
      {showCreateForm && (
        <div
          className="pd-create-overlay"
          onClick={closeCreateForm}
        >
          <section
            className="pd-create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-create-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pd-create-modal-header">
              <div>
                <span className="pd-modal-eyebrow">
                  PROJECT WORKSPACE
                </span>

                <h2 id="pd-create-title">Create new issue</h2>

                <p>
                  Add a task or problem to this project.
                </p>
              </div>

              <button
                type="button"
                className="pd-create-close"
                onClick={closeCreateForm}
                disabled={creating}
                aria-label="Close create issue form"
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="pd-create-modal-form"
              onSubmit={createIssue}
            >
              {createError && (
                <div className="pd-create-form-error">
                  {createError}
                </div>
              )}

              <div className="pd-create-field">
                <label htmlFor="pd-issue-title">
                  Issue title <span>*</span>
                </label>

                <Input
                  id="pd-issue-title"
                  value={newIssue.title}
                  onChange={(e) =>
                    setNewIssue((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div className="pd-create-field">
                <label htmlFor="pd-issue-description">
                  Description
                </label>

                <textarea
                  id="pd-issue-description"
                  className="pd-create-description"
                  value={newIssue.description}
                  onChange={(e) =>
                    setNewIssue((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the issue, expected behavior, or steps to reproduce..."
                  rows={5}
                />
              </div>

              <div className="pd-create-field">
                <label htmlFor="pd-issue-priority">
                  Priority
                </label>

                <select
                  id="pd-issue-priority"
                  className="pd-create-priority"
                  value={newIssue.priority}
                  onChange={(e) =>
                    setNewIssue((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pd-create-modal-actions">
                <Button
                  type="button"
                  onClick={closeCreateForm}
                  disabled={creating}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <RefreshCw size={15} className="pd-spinner" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Issue
                    </>
                  )}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {activityIssue && (
        <div
          className="pd-modal-overlay"
          onClick={closeActivity}
        >
          <div
            className="pd-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pd-modal-header">
              <div>
                <span>ISSUE ACTIVITY</span>
                <h3>{activityIssue.title}</h3>
              </div>

              <button
                type="button"
                className="pd-close"
                onClick={closeActivity}
                aria-label="Close activity"
              >
                <X size={18} />
              </button>
            </div>

            <div className="pd-modal-body">
              {activityLoading ? (
                <div className="pd-activity-message">
                  <RefreshCw size={22} className="pd-spinner" />
                  <p>Loading activity...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="pd-activity-message">
                  <Activity size={30} />
                  <p>No activity recorded yet.</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <div
                    className="pd-activity-item"
                    key={activity._id}
                  >
                    <div className="pd-activity-icon">
                      <Activity size={16} />
                    </div>

                    <div>
                      <strong>
                        {activity.user?.name || "User"}{" "}
                        {activity.details || activity.action}
                      </strong>

                      <small>
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
