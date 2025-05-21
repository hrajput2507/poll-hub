"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ScrollIcon as PollIcon,
  BarChart3Icon,
  Home,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { motion, AnimatePresence } from "framer-motion";

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const logoVariants = {
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <motion.div
      variants={navItemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      className="relative"
    >
      <Link
        href={href}
        className={`text-sm font-medium transition-colors duration-200 px-4 py-2 rounded-full ${
          isActive(href)
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {children}
      </Link>
      {isActive(href) && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between px-6 md:px-8 lg:px-8">
        <motion.div
          className="flex items-center gap-2"
          initial={false}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <PollIcon className="h-6 w-6 text-primary relative" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              PollHub
            </span>
          </Link>

          {user && (
            <motion.div
              className="hidden md:flex items-center gap-6 ml-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/polls/create">Create Poll</NavLink>
              <NavLink href="/dashboard/my-polls">My Polls</NavLink>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ModeToggle />

          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full border-2 border-muted-foreground/20 transition-all duration-300 hover:border-primary/50"
                  >
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <motion.span
                      className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/my-polls" className="cursor-pointer">
                      <BarChart3Icon className="mr-2 h-4 w-4" />
                      <span>My Polls</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button
                asChild
                className="bg-primary/90 hover:bg-primary relative overflow-hidden group"
              >
                <Link href="/auth/signup">
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  Sign up
                </Link>
              </Button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden border-t border-border"
          >
            <div className="container py-4 space-y-4 px-6">
              {user ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  className="flex flex-col gap-2"
                >
                  <NavLink href="/dashboard">Dashboard</NavLink>
                  <NavLink href="/polls/create">Create Poll</NavLink>
                  <NavLink href="/dashboard/my-polls">My Polls</NavLink>
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col gap-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  <motion.div variants={navItemVariants}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start sm:hidden"
                    >
                      <Link href="/auth/signin">Sign in</Link>
                    </Button>
                  </motion.div>
                  <motion.div variants={navItemVariants}>
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full justify-start"
                    >
                      <Link href="/polls">Browse Polls</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
