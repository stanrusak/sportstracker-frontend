import { useState } from "react";
import {
  DashboardIcon,
  ChartIcon,
  TestIcon,
  RobotIcon,
  SettingsIcon,
} from "./SidebarIcons";

const activeLight = "bg-accent shadow-light";

interface NavLinkType {
  title: string;
  icon: string;
  link: string;
}

const navLinks: NavLinkType[] = [
  { title: "Dashboard", icon: DashboardIcon, link: "" },
  { title: "Statistics", icon: ChartIcon, link: "" },
  { title: "Tests", icon: TestIcon, link: "" },
  { title: "AI", icon: RobotIcon, link: "" },
  { title: "Settings", icon: SettingsIcon, link: "" },
];

const NavLink = ({ navLink, active, setActivePage }) => {
  const SidebarIcon = navLink.icon;
  return (
    <li
      className="relative flex h-[50px] w-[50px] cursor-pointer items-center"
      onClick={() => setActivePage(navLink.title)}
    >
      <div
        className={`absolute left-4 h-1 w-1 rounded-full ${
          active ? activeLight : ""
        } transition-all duration-500`}
      >
        {" "}
      </div>
      <a className="flex flex-col items-center justify-center gap-2">
        <div
          className={`${
            active ? " translate-x-9 bg-accent shadow-selected-outer" : ""
          } duration-400 flex rounded-full p-1 text-slate-600 transition-all hover:text-accent`}
        >
          <div
            className={`inset-2 ${
              active ? "text-accent shadow-selected-inner" : ""
            } rounded-full bg-bgprimary-nav p-2`}
          >
            <SidebarIcon className="h-6 w-6 fill-current" />
          </div>
        </div>

        {/* <span className="">{navLink.title}</span> */}
      </a>
    </li>
  );
};

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <nav className="shadow-3xl absolute top-1/2 w-[70px] -translate-y-1/2 rounded-r-xl bg-bgprimary-nav py-5">
      <ul className="flex h-full w-full flex-col items-center justify-center gap-4">
        {navLinks.map((navLink) => (
          <NavLink
            key={`nav-${navLink.title}`}
            navLink={navLink}
            active={navLink.title === activePage}
            setActivePage={setActivePage}
          />
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
