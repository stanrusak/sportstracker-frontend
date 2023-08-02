import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";
import { useAuth } from "../utils/auth";

interface NavLink {
  name: string;
  target: string;
  onClick?: () => void;
}

const landingLinks: NavLink[] = [
  { name: "Sign up", target: "#signup" },
  // { name: "About", target: "/about" },
];

const loggedInLinks: NavLink[] = [
  {
    name: "Log out",
    target: "",
    onClick: () => localStorage.removeItem("token"),
  },
];

const NavLink = ({ link }: { link: NavLink }) => {
  return (
    <div className="m-4 cursor-pointer text-xs uppercase">
      <a
        href={link.target}
        className="duration-400 flex items-center gap-2 text-gray-500 transition-colors hover:text-accent"
        onClick={link.onClick}
      >
        {link.name}
      </a>
    </div>
  );
};

export const Navbar = () => {
  const [online, setOnline] = useState("");
  const { token } = useAuth();

  const links = token ? loggedInLinks : landingLinks;
  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setOnline(data.status);
      });
  }, []);
  const [toggle, setToggle] = useState(false);
  return (
    <nav
      className={`fixed z-10 flex h-navbar w-full justify-between bg-bgprimary-nav px-16 shadow-md`}
    >
      <div className="mx-4 flex items-center">
        <a
          href="/"
          className={`flex items-center text-3xl font-bold uppercase ${
            online ? "text-accent" : "text-red-500"
          }`}
        >
          <img className="h-[60px] w-[60px] object-cover" src={logo} />
          <h1>SportsTracker</h1>
        </a>
      </div>
      <div className="hidden items-center gap-2 font-semibold md:flex">
        {links.map((link) => (
          <NavLink link={link} key={link.name} />
        ))}
      </div>
      <div className="flex flex-col md:hidden">
        {!toggle && (
          <HiMenu
            className="m-2 h-10 w-10 text-accent"
            onClick={() => setToggle(true)}
          />
        )}
        {toggle && (
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            whileInView={{ y: [-300, 0], opacity: [0, 1] }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className=" flex flex-col items-end justify-end rounded-bl-lg bg-white shadow-md"
          >
            <HiX onClick={() => setToggle(false)} className="m-2 h-6 w-6" />
            <div className="flex flex-col items-end">
              {links.map((link) => (
                <NavLink link={link} key={`mobile-${link.name}`} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
