import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
}

interface TeamContextType {
  teams: Team[];
  addTeam: (data: { name: string }) => void;
  addMember: (teamId: number, data: { name: string; email: string }) => void;
  deleteMember: (teamId: number, memberId: number) => void;
  updateTeam: (teamId: number, data: { name: string }) => void;
  updateMember: (
    teamId: number,
    memberId: number,
    data: { name: string; email: string }
  ) => void;
  deleteTeam: (teamId: number) => void;
}

const STORAGE_KEY = 'teams-data';

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Team[]>(() => {
    const storedTeams = localStorage.getItem(STORAGE_KEY);
    return storedTeams ? JSON.parse(storedTeams) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }, [teams]);

  const addTeam = useCallback((data: { name: string }) => {
    setTeams((prevTeams) => [
      ...prevTeams,
      {
        id: prevTeams.length + 1,
        name: data.name,
        members: [],
      },
    ]);
  }, []);

  const addMember = useCallback(
    (teamId: number, data: { name: string; email: string }) => {
      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              members: [
                ...team.members,
                {
                  id: team.members.length + 1,
                  name: data.name,
                  email: data.email,
                },
              ],
            };
          }
          return team;
        })
      );
    },
    []
  );

  const deleteMember = useCallback((teamId: number, memberId: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.filter((member) => member.id !== memberId),
          };
        }
        return team;
      })
    );
  }, []);

  const updateTeam = useCallback((teamId: number, data: { name: string }) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === teamId ? { ...team, name: data.name } : team
      )
    );
  }, []);

  const updateMember = useCallback(
    (
      teamId: number,
      memberId: number,
      data: { name: string; email: string }
    ) => {
      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              members: team.members.map((member) =>
                member.id === memberId ? { ...member, ...data } : member
              ),
            };
          }
          return team;
        })
      );
    },
    []
  );

  const deleteTeam = useCallback((teamId: number) => {
    setTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
  }, []);

  const value = {
    teams,
    addTeam,
    addMember,
    deleteMember,
    updateTeam,
    updateMember,
    deleteTeam,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeams() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeams must be used within a TeamProvider");
  }
  return context;
}