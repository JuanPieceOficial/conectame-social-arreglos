import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Definimos los tipos de forma robusta
type SidebarContextType = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | null>(null);

/**
 * Hook para acceder al contexto del Sidebar.
 * Debe usarse dentro de un SidebarProvider.
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  
  // Estado para móvil y desktop por separado para evitar conflictos visuales
  const [openMobile, setOpenMobile] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);

  // Alternar el estado dependiendo de la plataforma
  const toggleSidebar = React.useCallback(() => {
    return isMobile
      ? setOpenMobile((prev) => !prev)
      : setOpen((prev) => !prev);
  }, [isMobile]);

  // El estado visual para CSS o animaciones
  const state = open ? "expanded" : "collapsed";

  // Memorizamos el valor para evitar re-renders innecesarios en los hijos
  const contextValue = React.useMemo<SidebarContextType>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, isMobile, openMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div 
        style={{ 
          display: "flex", 
          minHeight: "100vh", 
          width: "100%",
          // Aquí podrías añadir variables de CSS para el ancho del sidebar
          // "--sidebar-width": "16rem" 
        }}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}