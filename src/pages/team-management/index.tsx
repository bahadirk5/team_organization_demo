import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormModal } from "@/components/form-modal";
import { useTeams } from "@/context/team-context";

export default function TeamManagement() {
  const {
    teams,
    addTeam,
    addMember,
    updateTeam,
    updateMember,
    deleteMember,
    deleteTeam,
  } = useTeams();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleAddMember = (
    teamId: number,
    data: { name: string; email: string }
  ) => {
    addMember(teamId, data);
  };

  const handleUpdateTeam = (teamId: number, data: { name: string }) => {
    updateTeam(teamId, data);
  };

  const handleUpdateMember = (
    teamId: number,
    memberId: number,
    data: { name: string; email: string }
  ) => {
    updateMember(teamId, memberId, data);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <FormModal type="team" onSubmit={addTeam} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>
                    {team.members.length}{" "}
                    {team.members.length === 1 ? "member" : "members"}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <FormModal
                        type="team"
                        mode="edit"
                        initialData={{ name: team.name }}
                        onSubmit={(data) =>
                          handleUpdateTeam(team.id, data as { name: string })
                        }
                        trigger={
                          <button className="flex items-center w-full px-2 py-1.5">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Team</span>
                          </button>
                        }
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteTeam(team.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Team</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <FormModal
                          type="member"
                          mode="edit"
                          initialData={{
                            name: member.name,
                            email: member.email,
                          }}
                          onSubmit={(data) =>
                            handleUpdateMember(
                              team.id,
                              member.id,
                              data as { name: string; email: string }
                            )
                          }
                          trigger={
                            <button className="flex items-center w-full px-2 py-1.5">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit Member</span>
                            </button>
                          }
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMember(team.id, member.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <FormModal
                type="member"
                onSubmit={(data) =>
                  handleAddMember(
                    team.id,
                    data as { name: string; email: string }
                  )
                }
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
