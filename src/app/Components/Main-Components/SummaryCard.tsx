interface SummaryCardProps {
    title: string;
    value: string;
    color?: string;
}

export default function SummaryCard({ title, value, color = "blue" }: SummaryCardProps) {
    const getCardColors = (color: string) => {
        switch (color) {
            case "red":
                return { bg: "bg-red-100", text: "text-red-800" };
            case "green":
                return { bg: "bg-green-100", text: "text-green-800" };
            case "darkred":
                return { bg: "bg-red-300", text: "text-red-900" };
            case "yellow":
                return { bg: "bg-yellow-100", text: "text-yellow-800" };
            default:
                return { bg: "bg-blue-100", text: "text-gray-800" };
        }
    };

    const colors = getCardColors(color);

    return (
        <div className={`${colors.bg} ${colors.text} p-4 rounded-lg shadow-md`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}