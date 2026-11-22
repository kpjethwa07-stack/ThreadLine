
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Activity,
  FolderKanban,
  ListTodo,
} from "lucide-react";
import api from "../services/api";
import "./Dashboard.css";

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITIES = ["Low", "Medium", "High"];

function getProjectId(issue) {
  const project = issue.projectId || issue.project;
  return typeof project === "object" ? project?._id : project || "";
}

function getAssignee(issue) {
  const person = issue.assignee || issue.assignedTo;

  if (!person) return "Unassigned";
  if (typeof person === "string") return person;

  return (
    person.name ||
    person.fullName ||
    person.username ||
    person.email ||
    "Unassigned"
  );
}

function getDate(item) {
  const value = item.updatedAt || item.createdAt;
  return value ? new Date(value) : null;
}

function formatDate(date) {
  if (!date || Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getStatusClass(status = "") {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function getPriorityClass(priority = "Medium") {
  const value = priority.toLowerCase();

  if (value === "low") return "priority-text-low";
  if (value === "medium") return "priority-text-medium";

  // High and Critical use the high-priority appearance.
  return "priority-text-high";
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setError("");

        const projectRes = await api.get("/projects");
        const projectData =
          projectRes.data.projects || projectRes.data || [];

        const issueResults = await Promise.all(
          projectData.map((project) =>
            api.get(`/issues/project/${project._id}`)
          )
        );

        const allIssues = issueResults.flatMap((response) => {
          return response.data.issues || response.data || [];
        });

        if (!cancelled) {
          setProjects(projectData);
          setIssues(allIssues);
        }
      } catch (err) {
        console.error("Dashboard error:", err);

        if (!cancelled) {
          setError("Unable to load your workspace data. Please refresh.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalIssues = issues.length;

  const openIssues = issues.filter(
    (issue) => issue.status === "Open"
  ).length;

  const inProgress = issues.filter(
    (issue) => issue.status === "In Progress"
  ).length;

  const completed = issues.filter(
    (issue) =>
      issue.status === "Resolved" || issue.status === "Closed"
  ).length;

  const filteredIssues = useMemo(() => {
    return [...issues]
      .filter((issue) => {
        return (
          statusFilter === "All" ||
          issue.status === statusFilter
        );
      })
      .sort((a, b) => {
        return (
          (getDate(b)?.getTime() || 0) -
          (getDate(a)?.getTime() || 0)
        );
      });
  }, [issues, statusFilter]);

  const recentActivity = useMemo(() => {
    const issueActivity = issues.map((issue) => ({
      id: `issue-${issue._id}`,
      title: issue.title || "Untitled issue",
      detail: `${issue.status || "Open"} · ${
        issue.priority || "No priority"
      } priority`,
      date: getDate(issue),
      type: "issue",
    }));

    const projectActivity = projects.map((project) => ({
      id: `project-${project._id}`,
      title: project.name || "Untitled project",
      detail: "Project updated",
      date: getDate(project),
      type: "project",
    }));

    return [...issueActivity, ...projectActivity]
      .sort(
        (a, b) =>
          (b.date?.getTime() || 0) -
          (a.date?.getTime() || 0)
      )
      .slice(0, 5);
  }, [issues, projects]);

  const projectProgress = useMemo(() => {
    return projects.map((project) => {
      const relatedIssues = issues.filter(
        (issue) => getProjectId(issue) === project._id
      );

      const done = relatedIssues.filter(
        (issue) =>
          issue.status === "Resolved" ||
          issue.status === "Closed"
      ).length;

      const percent = relatedIssues.length
        ? Math.round((done / relatedIssues.length) * 100)
        : 0;

      return {
        ...project,
        issueCount: relatedIssues.length,
        completedCount: done,
        percent,
      };
    });
  }, [projects, issues]);

  // UI-only quick controls: update the displayed state immediately.
  function updateIssueLocally(issueId, field, value) {
    setIssues((current) =>
      current.map((issue) =>
        issue._id === issueId
          ? { ...issue, [field]: value }
          : issue
      )
    );
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your workspace...
      </div>
    );
  }

  return (
    <div className="dashboard">
      {error && <div className="dashboard-error">{error}</div>}

      {/* HERO */}
      <section className="dashboard-heading">
        <div>
          <span className="heading-kicker">YOUR WORKSPACE</span>
          <h2>Good to see you again.</h2>
          <p>
            Here's what's happening across your projects today.
          </p>
        </div>

        <div className="dashboard-actions">
          <Link to="/projects" className="dashboard-create-link">
            <Plus size={15} />
            Explore projects
          </Link>

          <Link to="/search" className="dashboard-secondary-link">
            View issues
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="dashboard-stats">
        <div className="dashboard-stat">
          <span className="stat-label">Open issues</span>
          <strong>{openIssues}</strong>
          <small>Awaiting attention</small>
        </div>

        <div className="dashboard-stat">
          <span className="stat-label">In progress</span>
          <strong>{inProgress}</strong>
          <small>Currently being worked on</small>
        </div>

        <div className="dashboard-stat">
          <span className="stat-label">Completed</span>
          <strong>{completed}</strong>
          <small>Resolved or closed</small>
        </div>

        <div className="dashboard-stat">
          <span className="stat-label">Projects</span>
          <strong>{projects.length}</strong>
          <small>In your workspace</small>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="dashboard-grid">
        {/* ISSUES */}
        <div className="dashboard-panel issues-panel">
          <div className="panel-head">
            <div>
              <h3>Issues overview</h3>
              <p>Track and manage your latest issues</p>
            </div>

            <Link to="/search" className="panel-link">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="filter-row">
            <span>RECENT ISSUES</span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter issues by status"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="table-scroll">
            <table className="issue-table">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="table-empty">
                      <div className="filtered-empty">
                        <span>
                          {statusFilter === "All"
                            ? "No issues found yet."
                            : `No ${statusFilter.toLowerCase()} issues found.`}
                        </span>

                        {statusFilter !== "All" && (
                          <button
                            type="button"
                            onClick={() => setStatusFilter("All")}
                          >
                            Clear filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIssues.slice(0, 8).map((issue) => {
                    const project = projects.find(
                      (item) => item._id === getProjectId(issue)
                    );

                    const priority = issue.priority || "Medium";

                    return (
                      <tr key={issue._id}>
                        <td>
                          <span className="issue-title">
                            {issue.title || "Untitled issue"}
                          </span>
                          <span className="issue-id">
                            #{String(issue._id).slice(-6)}
                          </span>
                        </td>

                        <td>{project?.name || "—"}</td>

                        <td>
                          <select
                            className={`quick-select status-select status-${getStatusClass(
                              issue.status
                            )}`}
                            value={issue.status || "Open"}
                            onChange={(event) =>
                              updateIssueLocally(
                                issue._id,
                                "status",
                                event.target.value
                              )
                            }
                            aria-label={`Change status for ${issue.title}`}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td>{getAssignee(issue)}</td>

                        <td>
                          <div className="priority-control">
                            <select
                              className="priority-native-select"
                              value={priority}
                              onChange={(event) =>
                                updateIssueLocally(
                                  issue._id,
                                  "priority",
                                  event.target.value
                                )
                              }
                              aria-label={`Change priority for ${issue.title}`}
                            >
                              {PRIORITIES.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>

                            <span
                              className={`priority-pill ${getPriorityClass(
                                priority
                              )}`}
                              aria-hidden="true"
                            >
                              <span>{priority}</span>
                            </span>
                          </div>
                        </td>

                        <td>{formatDate(getDate(issue))}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDE PANELS */}
        <div className="dashboard-side-panels">
          <div className="dashboard-panel">
            <div className="panel-head">
              <div>
                <h3>Projects</h3>
                <p>Progress at a glance</p>
              </div>

              <Link to="/projects" className="panel-link">
                View <ArrowRight size={14} />
              </Link>
            </div>

            {projectProgress.length === 0 ? (
              <div className="panel-empty">
                <FolderKanban size={23} />
                <p>No projects yet.</p>
                <Link to="/projects">Explore projects</Link>
              </div>
            ) : (
              <div className="project-list">
                {projectProgress.slice(0, 5).map((project) => (
                  <Link
                    to={`/projects/${project._id}`}
                    className="project-row"
                    key={project._id}
                  >
                    <div className="project-top">
                      <span className="project-name">
                        {project.name}
                      </span>
                      <span className="project-percent">
                        {project.percent}%
                      </span>
                    </div>

                    <p className="project-desc">
                      {project.description || "Workspace project"}
                    </p>

                    <div
                      className="track"
                      role="progressbar"
                      aria-valuenow={project.percent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={`${project.name} completion`}
                    >
                      <div
                        className="bar"
                        style={{ width: `${project.percent}%` }}
                      />
                    </div>

                    <div className="project-meta">
                      <span>
                        {project.completedCount} of {project.issueCount} completed
                      </span>
                      <span>{project.status || "Active"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* RECENT ACTIVITY */}
          <div className="dashboard-panel">
            <div className="panel-head">
              <div>
                <h3>Recent activity</h3>
                <p>Latest workspace updates</p>
              </div>
              <Activity size={17} className="activity-heading-icon" />
            </div>

            {recentActivity.length === 0 ? (
              <div className="panel-empty">
                <Activity size={22} />
                <p>Your recent updates will appear here.</p>
              </div>
            ) : (
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div className="activity-row" key={activity.id}>
                    <span className="activity-marker">
                      {activity.type === "project" ? (
                        <FolderKanban size={13} />
                      ) : (
                        <ListTodo size={13} />
                      )}
                    </span>

                    <div className="activity-text">
                      <strong>{activity.title}</strong>
                      <span>{activity.detail}</span>
                      <span className="activity-time">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
