import { getInitials } from "@/lib/utils"

describe("getInitials", () => {
    it("deve retornar a primeira letra maiúscula se o nome tiver apenas uma palavra", () => {
        expect(getInitials("Rayara")).toBe("R")
    })

    it("deve retornar as iniciais da primeira e última palavra", () => {
        expect(getInitials("Sidney Lima")).toBe("SL")
        expect(getInitials("Rayara Kelly Correia")).toBe("RC")
    })

    it("deve lidar com espaços extras corretamente", () => {
        expect(getInitials("  Sidney   Lima ")).toBe("SL")
    })

    it("deve retornar string vazia se for chamada com string vazia", () => {
        expect(getInitials("")).toBe("")
    })
})
