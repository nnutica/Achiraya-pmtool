import SummaryCard from "./SummaryCard";

interface ProjectStats {
    total: number;
    ongoing: number;
    completed: number;
    overdue: number;
    lts: number;
    cancelled: number;
}

interface ProjectStatsSectionProps {
    stats: ProjectStats;
}

export default function ProjectStatsSection({ stats }: ProjectStatsSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 2xl:grid-cols-6 gap-4 mt-6">
            <SummaryCard title="Total Projects" value={stats.total.toString()} />
            <SummaryCard title="Ongoing Projects" value={stats.ongoing.toString()} />
            <SummaryCard title="Completed Projects" value={stats.completed.toString()} />
            <SummaryCard title="Overdue Projects" value={stats.overdue.toString()} color="red" />
            <SummaryCard title="LTS Projects" value={stats.lts.toString()} color="green" />
            <SummaryCard title="Cancelled Projects" value={stats.cancelled.toString()} color="darkred" />
        </div>
    );
}