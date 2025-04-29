import { formatDays } from "@/lib/utils"

describe("formatDays", () => {
    it("deve retornar 'Não disponível' se for undefined", () => {
        expect(formatDays(undefined)).toBe("Não disponível")
    })

    it("deve retornar 'Não disponível' se o array for vazio", () => {
        expect(formatDays([])).toBe("Não disponível")
    })

    it("deve retornar 'Todos os dias' se incluir 'Todos'", () => {
        expect(formatDays(["Todos"])).toBe("Todos os dias")
        expect(formatDays(["Segunda", "Todos"])).toBe("Todos os dias")
    })

    it("deve retornar 'Fim de semana' se incluir 'Fim de semana'", () => {
        expect(formatDays(["Fim de semana"])).toBe("Fim de semana")
        expect(formatDays(["Sábado", "Fim de semana"])).toBe("Fim de semana")
    })

    it("deve retornar os dias separados por vírgula", () => {
        expect(formatDays(["Segunda", "Terça", "Quarta"])).toBe("Segunda, Terça, Quarta")
    })
})
