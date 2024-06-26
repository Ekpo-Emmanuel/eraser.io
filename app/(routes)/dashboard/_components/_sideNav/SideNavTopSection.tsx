import React, { useEffect, useState } from "react";
import Image from "@/node_modules/next/image";
import {
  ChevronDown,
  Users,
  Settings,
  LogOut,
  Files,
  FolderPlus,
  ChevronRight,
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "@/node_modules/next/link";
import { api } from "@/convex/_generated/api";
import { useRouter } from "@/node_modules/next/navigation";
import { useConvex, useQuery } from "convex/react";
import LoadingAnimation from "@/app/_components/LoadingAnimation";

interface User {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

interface Team {
  _id: string;
  createdBy: string;
  teamName: string;
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  link: string;
}


export default function SideNavTopSection({ user, setActiveTeamInfo }: any) {
  const {
    email,
    given_name: firstName,
    family_name: lastName,
    picture,
  } = user || {};
  
  const router = useRouter();
  const convex = useConvex();
  const [activeTeam,setActiveTeam] = useState<Team>();
  const [teamList, setTeamList] = useState<Team[]>();

  const userEmail = email ? String(email) : "";

  useEffect(() => {
    if (user) {
      getTeamList();
    }
  }, [user]);

  useEffect(() => {
    if (activeTeam) {
      setActiveTeamInfo(activeTeam);
    }
  }, [activeTeam, setActiveTeamInfo]);

  const getTeamList = async() => {
    const result = await convex.query(api.teams.getTeam, { email : user?.email })
    setTeamList(result);
    setActiveTeam(result[0]);
  }

  const onMenuClick = (item: any) => {
    setActiveTeam(item);
  };

  const menu: MenuItem[] = [
    { name: "Join or Create Team", icon: Users, link: "/teams/create" },
    { name: "Settings", icon: Settings, link: "/" },
  ];

  const cutWordLength = (str: string | undefined, limit: number) => {
    if (str && str.length > limit) {
      return str.slice(0, limit) + "...";
    }
    return str;
  };

  // if (isLoading) return <LoadingAnimation />;

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer p-2 rounded-sm hover:bg-slate-100 focus:bg-slate-100">
            <div className="text-md font-semibold flex items-center gap-2 capitalize">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                width={20}
                height={20}
                alt="logo"
              />
              {cutWordLength(activeTeam?.teamName, 15)}
            </div>
            <ChevronDown strokeWidth={2} size={20} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            {teamList
              ?.slice()
              .reverse()
              .map(
                (team: Team, index): React.JSX.Element => (
                  <DropdownMenuItem
                    key={index}
                    className={`text-[13px] font-semibold py-[4px] ${
                      activeTeam?._id === team._id
                        ? "bg-blue-500 text-white hover:bg-blue-500"
                        : ""
                    }`}
                    onClick={() => setActiveTeam(team)}
                  >
                    {team.teamName}
                  </DropdownMenuItem>
                )
              )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-[13px] font-semibold py-[4px]">
                Invite users
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="text-[13px] py-[4px]">
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[13px] py-[4px]">
                    Message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-[13px] py-[4px]">
                    More...
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {menu.map((item, index) => (
              <Link href={item.link} key={index}>
                <DropdownMenuItem className="text-[13px] font-semibold py-[4px] flex gap-2">
                  <item.icon size={16} strokeWidth={1} /> {item.name}
                </DropdownMenuItem>
              </Link>
            ))}
            <LogoutLink>
              <DropdownMenuItem className="text-[13px] font-semibold py-[4px] flex gap-2">
                <LogOut size={16} strokeWidth={1} />
                Logout
              </DropdownMenuItem>
            </LogoutLink>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
          <DropdownMenuItem className="flex items-center gap-2">
            {user?.picture ? (
              <Image
                src={String(user.picture)}
                alt={user.firstName || "User"}
                width={30}
                height={30}
                className="rounded-full"
              />
            ) : (
              <div className="rounded-full h-[34px] w-[34px] bg-black" />
            )}
            <div className="flex flex-col line-h--10">
              <p className="text-[14px] font-semibold">
                {firstName} {lastName}
              </p>
              <p className="text-[11px] ">{userEmail}</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <div className='flex items-center justify-between cursor-pointer py-2 px-4 mt-8 rounded-sm hover:bg-slate-100 '>
                <p className='flex gap-2 align-center items-center text-[14px] font-semibold'>
                    <Files size={16} />All Files
                </p>
                <p className='text-[11px]'>A</p>
            </div>
            <div className='flex items-center justify-between py-2 px-4 mt-4'>
                <p className='flex gap-2 align-center items-center text-[11px] uppercase  cursor-default'>
                    Team Folders
                </p>
                <p className='text-[11px] cursor-pointer hover:font-semibold'>
                    <FolderPlus size={14} strokeWidth={2} />
                </p>
            </div>
            <div className='flex flex-col items-center justify-between cursor-pointer py-1rounded-sm '>
                <div className='text-[13px] pl-4 w-full rounded-sm py-2 text-black hover:bg-slate-100 flex align-center gap-2'>
                    <ChevronRight size={16} strokeWidth={1} />
                    <span>Untitled Folder </span>
                </div>
            </div> */}
    </div>
  );
}