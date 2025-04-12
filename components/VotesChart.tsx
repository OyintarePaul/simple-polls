"use client"

import { Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

interface VotesChartData {
    optionText: string,
    voteCount: number
}

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
}

export default function VotesChart({ data }: { data: VotesChartData[] }) {
    return (
        <div>
            <ChartContainer config={chartConfig}>
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie data={data} dataKey="voteCount" nameKey="optionText" fill="var(--primary)" stroke="var(--foreground)" strokeWidth={4}/>
                </PieChart>
            </ChartContainer>
        </div>
    )
}