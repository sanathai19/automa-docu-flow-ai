
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { cn } from "@/lib/utils"

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => undefined,
})

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { collapsed } = React.useContext(SidebarContext)

  return (
    <aside
      className={cn(
        "h-screen border-r bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {children}
    </aside>
  )
}

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-sidebar-foreground",
        ghost: "hover:bg-transparent hover:text-sidebar-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function SidebarTrigger() {
  const { collapsed, setCollapsed } = React.useContext(SidebarContext)

  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
    >
      {collapsed ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex h-14 items-center border-b px-4">{children}</header>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-auto">{children}</div>
}

export function SidebarFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="flex h-14 items-center border-t px-4">{children}</footer>
  )
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>
}

export function SidebarGroupLabel({
  children,
}: {
  children: React.ReactNode
}) {
  const { collapsed } = React.useContext(SidebarContext)

  if (collapsed) {
    return null
  }

  return (
    <div className="mb-2 px-2 text-xs uppercase text-sidebar-foreground/60">
      {children}
    </div>
  )
}

export function SidebarGroupContent({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="space-y-1">{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav>{children}</nav>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "ghost"
  asChild?: boolean
}

export function SidebarMenuButton({
  className,
  variant,
  asChild = false,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed } = React.useContext(SidebarContext)
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, className }))}
      {...props}
    />
  )
}
