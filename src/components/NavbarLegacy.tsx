import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, Mic, Search, Video } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  showSearch?: boolean;
  onToggleSidebar?: () => void;
}

export { default } from "./layout/NavbarLegacy";
