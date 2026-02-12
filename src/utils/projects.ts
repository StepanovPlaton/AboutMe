// Project data configuration file
// Used to manage data for the project display page
const projectModules = import.meta.glob('../content/projects/*.json', { eager: true });

export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    category: "actual" | "history" | "other";
    techStack: string[];
    status: "completed" | "in-progress" | "planned" | "paused";
    demoUrl?: string;
    sourceUrl?: string;
    startDate: string;
    endDate?: string;
    featured?: boolean;
    tags?: string[];
}

export const projectsData: Project[] = Object.entries(projectModules).map(([path, mod]: [string, any]) => {
    const id = path.split('/').pop()?.replace('.json', '') || '';
    const data = mod.default as any;
    const project: Project = {
        id,
        ...data,
        demoUrl: data.demoUrl ?? data.liveDemo,
        sourceUrl: data.sourceUrl ?? data.sourceCode,
    };
    return project;
});

// Get project statistics
export const getProjectStats = () => {
    const total = projectsData.length;
    const completed = projectsData.filter((p) => p.status === "completed").length;
    const inProgress = projectsData.filter(
        (p) => p.status === "in-progress",
    ).length;
    const planned = projectsData.filter((p) => p.status === "planned").length;
    const paused = projectsData.filter((p) => p.status === "paused").length;
    return {
        total,
        byStatus: {
            completed,
            inProgress,
            planned,
            paused,
        },
    };
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
    let filteredProjects: Project[];
    if (!category || category === "all") {
        filteredProjects = projectsData;
    } else {
        filteredProjects = projectsData.filter((p) => p.category === category);
    }
    // Exclude featured projects and in-progress projects from category lists
    // (they are shown in their dedicated sections)
    filteredProjects = filteredProjects.filter((p) => !p.featured && p.status !== "in-progress");
    // Sort by startDate in descending order (newest first)
    return filteredProjects.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
    });
};

// Get featured projects
export const getFeaturedProjects = () => {
    return projectsData.filter((p) => p.featured === true);
};

// Get in-work projects (in-progress status, excluding featured)
export const getInWorkProjects = () => {
    return projectsData
        .filter((p) => p.status === "in-progress" && !p.featured)
        .sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA;
        });
};

// Get all tech stacks
export const getAllTechStack = () => {
    // Создаем Map для хранения информации о каждой технологии
    const techMap = new Map<string, { count: number; latestProjectDate: number }>();
    
    // Подсчитываем упоминания и находим самую свежую дату проекта для каждой технологии
    projectsData.forEach((project) => {
        const projectDate = new Date(project.startDate).getTime();
        project.techStack.forEach((tech) => {
            const existing = techMap.get(tech);
            if (existing) {
                existing.count++;
                // Обновляем дату, если текущий проект свежее
                if (projectDate > existing.latestProjectDate) {
                    existing.latestProjectDate = projectDate;
                }
            } else {
                techMap.set(tech, { count: 1, latestProjectDate: projectDate });
            }
        });
    });
    
    // Преобразуем Map в массив и сортируем
    // Сначала по количеству упоминаний (по убыванию), затем по дате самого свежего проекта (по убыванию)
    return Array.from(techMap.entries())
        .sort((a, b) => {
            const [techA, dataA] = a;
            const [techB, dataB] = b;
            
            // Сначала сортируем по количеству упоминаний (по убыванию)
            if (dataB.count !== dataA.count) {
                return dataB.count - dataA.count;
            }
            
            // Если количество одинаковое, сортируем по дате самого свежего проекта (по убыванию)
            return dataB.latestProjectDate - dataA.latestProjectDate;
        })
        .map(([tech]) => tech); // Возвращаем только названия технологий
};