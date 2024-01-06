import { cn } from "@/src/lib/utils";
import {
    createContext,
    Dispatch,
    HTMLAttributes,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

export type Theme = "dark" | "light";

type ThemeContextProps = {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
};

const ThemeContext = createContext<ThemeContextProps>({
    theme: "dark",
    setTheme: () => {},
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return [context.theme, context.setTheme] as const;
};

type ThemeProviderProps = HTMLAttributes<HTMLBodyElement>;

function ThemeProvider({ children, className, ...props }: ThemeProviderProps) {
    const [themeState, setThemeState] = useState<Theme>("dark");

    const setTheme = (value: SetStateAction<Theme>) => {
        const newTheme =
            typeof value === "function" ? value(themeState) : value;
        setThemeState(newTheme);
        if (
            typeof window !== "undefined" &&
            typeof localStorage !== "undefined"
        ) {
            localStorage.setItem("theme", newTheme);
        }
    };

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            typeof localStorage !== "undefined"
        ) {
            const localTheme = localStorage.getItem("theme");
            if (localTheme) setThemeState(localTheme as Theme);
        }
    }, []);

    const theme = themeState;

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <body className={cn(theme, className)} {...props}>
                {children}
            </body>
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
