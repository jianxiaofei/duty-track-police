// 主题配置
export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    deviceFrame: string;
    deviceScreen: string;
    glass: string;
    glassBorder: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
  };
}

export const themes: Theme[] = [
  {
    id: "classic-purple",
    name: "经典紫",
    description: "原始的蓝紫渐变主题",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#f093fb",
      background:
        "radial-gradient(ellipse at center, #2d3748 0%, #1a202c 100%)",
      deviceFrame: "linear-gradient(145deg, #2d3748, #4a5568)",
      deviceScreen: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      glass: "rgba(255, 255, 255, 0.1)",
      glassBorder: "rgba(255, 255, 255, 0.2)",
      text: {
        primary: "#FFFFFF",
        secondary: "#E2E8F0",
        muted: "#A0AEC0",
      },
      status: {
        success: "#48BB78",
        warning: "#ED8936",
        error: "#F56565",
        info: "#4299E1",
      },
    },
  },
  {
    id: "prison-dark",
    name: "监狱深色",
    description: "严肃的深色主题，适合监狱环境",
    colors: {
      primary: "#374151",
      secondary: "#4B5563",
      accent: "#F59E0B",
      background:
        "radial-gradient(ellipse at center, #1F2937 0%, #111827 100%)",
      deviceFrame: "linear-gradient(145deg, #374151, #4B5563)",
      deviceScreen: "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
      glass: "rgba(75, 85, 99, 0.15)",
      glassBorder: "rgba(156, 163, 175, 0.2)",
      text: {
        primary: "#F9FAFB",
        secondary: "#D1D5DB",
        muted: "#9CA3AF",
      },
      status: {
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
    },
  },
  {
    id: "industrial",
    name: "工业风格",
    description: "硬朗的工业风格，体现严格管理",
    colors: {
      primary: "#1E293B",
      secondary: "#334155",
      accent: "#EAB308",
      background:
        "radial-gradient(ellipse at center, #0F172A 0%, #020617 100%)",
      deviceFrame: "linear-gradient(145deg, #1E293B, #334155)",
      deviceScreen: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
      glass: "rgba(51, 65, 85, 0.15)",
      glassBorder: "rgba(148, 163, 184, 0.25)",
      text: {
        primary: "#F8FAFC",
        secondary: "#CBD5E1",
        muted: "#94A3B8",
      },
      status: {
        success: "#22C55E",
        warning: "#EAB308",
        error: "#DC2626",
        info: "#0EA5E9",
      },
    },
  },
  {
    id: "military",
    name: "军事绿",
    description: "军事化管理风格，强调纪律性",
    colors: {
      primary: "#14532D",
      secondary: "#166534",
      accent: "#CA8A04",
      background:
        "radial-gradient(ellipse at center, #052E16 0%, #0C1C0C 100%)",
      deviceFrame: "linear-gradient(145deg, #14532D, #166534)",
      deviceScreen: "linear-gradient(135deg, #14532D 0%, #052E16 100%)",
      glass: "rgba(22, 101, 52, 0.2)",
      glassBorder: "rgba(74, 222, 128, 0.25)",
      text: {
        primary: "#F0FDF4",
        secondary: "#BBF7D0",
        muted: "#86EFAC",
      },
      status: {
        success: "#16A34A",
        warning: "#CA8A04",
        error: "#DC2626",
        info: "#0284C7",
      },
    },
  },
  {
    id: "security-blue",
    name: "安全蓝",
    description: "专业的安全管理主题",
    colors: {
      primary: "#1E3A8A",
      secondary: "#1D4ED8",
      accent: "#F97316",
      background:
        "radial-gradient(ellipse at center, #1E3A8A 0%, #0F172A 100%)",
      deviceFrame: "linear-gradient(145deg, #1E3A8A, #1D4ED8)",
      deviceScreen: "linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)",
      glass: "rgba(29, 78, 216, 0.15)",
      glassBorder: "rgba(147, 197, 253, 0.25)",
      text: {
        primary: "#F0F9FF",
        secondary: "#DBEAFE",
        muted: "#93C5FD",
      },
      status: {
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
        info: "#2563EB",
      },
    },
  },

  {
    id: "minimal-gray",
    name: "极简灰",
    description: "简洁的灰色主题，低调专业",
    colors: {
      primary: "#374151",
      secondary: "#6B7280",
      accent: "#10B981",
      background:
        "radial-gradient(ellipse at center, #1F2937 0%, #0F1419 100%)",
      deviceFrame: "linear-gradient(145deg, #374151, #6B7280)",
      deviceScreen: "linear-gradient(135deg, #374151 0%, #1F2937 100%)",
      glass: "rgba(107, 114, 128, 0.1)",
      glassBorder: "rgba(156, 163, 175, 0.2)",
      text: {
        primary: "#F9FAFB",
        secondary: "#D1D5DB",
        muted: "#9CA3AF",
      },
      status: {
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
    },
  },
];

export const getTheme = (themeId: string): Theme => {
  return themes.find((theme) => theme.id === themeId) || themes[0];
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  // 应用CSS变量
  root.style.setProperty("--theme-primary", theme.colors.primary);
  root.style.setProperty("--theme-secondary", theme.colors.secondary);
  root.style.setProperty("--theme-accent", theme.colors.accent);
  root.style.setProperty("--theme-glass", theme.colors.glass);
  root.style.setProperty("--theme-glass-border", theme.colors.glassBorder);
  root.style.setProperty("--theme-text-primary", theme.colors.text.primary);
  root.style.setProperty("--theme-text-secondary", theme.colors.text.secondary);
  root.style.setProperty("--theme-text-muted", theme.colors.text.muted);
  root.style.setProperty("--theme-success", theme.colors.status.success);
  root.style.setProperty("--theme-warning", theme.colors.status.warning);
  root.style.setProperty("--theme-error", theme.colors.status.error);
  root.style.setProperty("--theme-info", theme.colors.status.info);

  // 更新设备外壳和屏幕背景
  const deviceContainer = document.querySelector(
    ".device-container"
  ) as HTMLElement;
  const deviceFrame = document.querySelector(".device-frame") as HTMLElement;
  const deviceScreen = document.querySelector(".device-screen") as HTMLElement;

  if (deviceContainer) {
    deviceContainer.style.background = theme.colors.background;
  }

  if (deviceFrame) {
    deviceFrame.style.background = theme.colors.deviceFrame;
  }

  if (deviceScreen) {
    deviceScreen.style.background = theme.colors.deviceScreen;
  }

  // 更新所有玻璃效果元素
  const glassElements = document.querySelectorAll(".glass-effect");
  glassElements.forEach((element) => {
    const el = element as HTMLElement;
    el.style.background = theme.colors.glass;
    el.style.borderColor = theme.colors.glassBorder;
  });
};
