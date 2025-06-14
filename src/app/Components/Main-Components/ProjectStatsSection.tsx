import SummaryCard from "./SummaryCard";

interface ProjectStats {
    total: number;
    ongoing: number;
    completed: number;
    overdue: number;
    lts: number;
    cancelled: number;
    onHold: number;
}

interface ProjectStatsSectionProps {
    stats: ProjectStats;
}

export default function ProjectStatsSection({ stats }: ProjectStatsSectionProps) {
    // สร้าง array ของ cards และกรองเฉพาะที่มีค่ามากกว่า 0
    const cardData = [
        { title: "Total Projects", value: stats.total, color: "blue" },
        { title: "Ongoing Projects", value: stats.ongoing, color: "blue" },
        { title: "Completed Projects", value: stats.completed, color: "blue" },
        { title: "Overdue Projects", value: stats.overdue, color: "red" },
        { title: "On Hold Projects", value: stats.onHold, color: "yellow" },
        { title: "LTS Projects", value: stats.lts, color: "green" },
        { title: "Cancelled Projects", value: stats.cancelled, color: "darkred" }
    ];

    // กรองเฉพาะ cards ที่มีค่ามากกว่า 0 (ยกเว้น Total Projects ที่แสดงเสมอ)
    const visibleCards = cardData.filter(card =>
        card.title === "Total Projects" || card.value > 0
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4 mt-6">
            {visibleCards.map((card, index) => (
                <SummaryCard
                    key={index}
                    title={card.title}
                    value={card.value.toString()}
                    color={card.color}
                />
            ))}
        </div>
    );
}