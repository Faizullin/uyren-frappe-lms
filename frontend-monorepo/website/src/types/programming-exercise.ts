export interface ProgrammingExercise {
  id: string
  title: string
  description: string
  tags: string[]
  difficulty: 'easy' | 'medium' | 'hard'
}
export interface ProgrammingExercises {
  exercises: ProgrammingExercise[]
}
export interface TestCase {
  input: any
  expectedOutput: any
}
