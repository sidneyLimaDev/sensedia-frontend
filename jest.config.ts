import nextJest from "next/jest"
import path from "path"

const createJestConfig = nextJest({ dir: "./" })

const customJestConfig = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/(.*)$": path.join("<rootDir>", "src", "$1") // Evita erro de barra invertida
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
}

export default createJestConfig(customJestConfig)
