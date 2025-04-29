export const getInitials = (name: string) => {
    const names = name.trim().split(" ")
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase()
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
}

export const formatDays = (days: string[] | undefined) => {
    if (!days || days.length === 0) return "Não disponível";
    if (days.includes("Todos")) return "Todos os dias";
    if (days.includes("Fim de semana")) return "Fim de semana";
    return days.join(", ");
};
