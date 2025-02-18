import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTeams } from "@/context/team-context";

export default function TeamChart() {
  const { teams } = useTeams();

  const teamMemberData = teams.map((team) => ({
    name: team.name,
    members: team.members.length,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

  const chartConfig = teams.reduce(
    (config, team) => {
      config[team.name] = {
        label: team.name,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      };
      return config;
    },
    {
      members: {
        label: "Members",
      },
    } as ChartConfig
  );

  const totalMembers = teams.reduce(
    (sum, team) => sum + team.members.length,
    0
  );

  const maxMembers = Math.max(...teamMemberData.map(team => team.members));

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Team Distribution</CardTitle>
          <CardDescription>Member count by team</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={teamMemberData}
                dataKey="members"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Total members: {totalMembers}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing member distribution across teams
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Number of members per team</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={teamMemberData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                domain={[0, maxMembers + 2]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar 
                dataKey="members" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Average team size: {(totalMembers / teams.length).toFixed(1)} members
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing member count for each team
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}