import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { useTeams } from "@/context/team-context";
import { UserMinus, Eye, EyeOff } from "lucide-react";

interface MenuState {
  id: string;
  isTeamNode: boolean;
  teamId: number;
  memberId?: number;
  top: number;
  left: number;
}

interface ContextMenuProps extends MenuState {
  onClick?: (e: React.MouseEvent) => void;
}

export default function Diagram() {
  const { teams, deleteMember } = useTeams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [hiddenMembers, setHiddenMembers] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  const generateNodes = useCallback(() => {
    const teamNodes: Node[] = teams.map((team, index) => ({
      id: `team-${team.id}`,
      type: "default",
      data: { label: team.name },
      position: { x: index * 500, y: 0 },
      style: {
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      },
    }));

    const memberNodes: Node[] = teams.flatMap((team) =>
      team.members.map((member, memberIndex) => ({
        id: `member-${team.id}-${member.id}`,
        type: "default",
        data: { label: `${member.name} (${member.email})` },
        position: {
          x: memberIndex * 200,
          y: 100,
        },
        parentNode: `team-${team.id}`,
        hidden: hiddenMembers.has(`team-${team.id}`),
        style: {
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          width: 180,
        },
      }))
    );

    setNodes([...teamNodes, ...memberNodes]);
  }, [teams, hiddenMembers, setNodes]);

  const generateEdges = useCallback(() => {
    const memberEdges: Edge[] = teams.flatMap((team) =>
      team.members.map((member) => ({
        id: `edge-${team.id}-${member.id}`,
        source: `team-${team.id}`,
        target: `member-${team.id}-${member.id}`,
        hidden: hiddenMembers.has(`team-${team.id}`),
      }))
    );

    setEdges(memberEdges);
  }, [teams, hiddenMembers, setEdges]);

  React.useEffect(() => {
    generateNodes();
    generateEdges();
  }, [generateNodes, generateEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault();

      if (!ref.current) return;

      const flowPosition = ref.current.getBoundingClientRect();
      const x = event.clientX - flowPosition.left;
      const y = event.clientY - flowPosition.top;

      const isTeamNode = node.id.startsWith("team-");
      const [_, teamId, memberId] = node.id.split("-");

      setMenu({
        id: node.id,
        isTeamNode,
        teamId: parseInt(teamId),
        memberId: memberId ? parseInt(memberId) : undefined,
        top: y,
        left: x + 10,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const toggleMembersVisibility = (teamId: number) => {
    setHiddenMembers((prev) => {
      const newSet = new Set(prev);
      const teamKey = `team-${teamId}`;
      if (newSet.has(teamKey)) {
        newSet.delete(teamKey);
      } else {
        newSet.add(teamKey);
      }
      return newSet;
    });
  };

  function ContextMenu({
    top,
    left,
    isTeamNode,
    teamId,
    memberId,
  }: ContextMenuProps) {
    const isHidden = hiddenMembers.has(`team-${teamId}`);

    const handleAction = (action: "toggle-visibility" | "delete-member") => {
      switch (action) {
        case "toggle-visibility":
          toggleMembersVisibility(teamId);
          break;
        case "delete-member":
          if (memberId) {
            deleteMember(teamId, memberId);
          }
          break;
      }
      setMenu(null);
    };

    return (
      <div
        style={{
          position: "absolute",
          top: top - 10,
          left,
          zIndex: 1000,
        }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden min-w-48"
      >
        {isTeamNode ? (
          <div className="py-1">
            <button
              onClick={() => handleAction("toggle-visibility")}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {isHidden ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Show Members
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide Members
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="py-1">
            <button
              onClick={() => handleAction("delete-member")}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Delete Member
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ReactFlow
        ref={ref as any}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        fitView
      >
        <Background gap={20} size={1} />
        {menu && <ContextMenu onClick={(e) => e.stopPropagation()} {...menu} />}
      </ReactFlow>
    </div>
  );
}
