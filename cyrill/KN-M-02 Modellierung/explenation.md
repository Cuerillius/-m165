# Diagramm to show who has which Badge

## Exlpenation

- Solid lines mean nesting: Troop is nested inside ScoutHierarchy, and Group/Course are nested inside Troop. This means these are embedded documents in MongoDB.

- Dotted lines mean references: Group and Course refer to Scout. They store references (like IDs) to Scout documents in a separate collection, rather than embedding all scout data. They are refrenced because they need to be changed frequently.

## Different Collections

- ScoutHierarchy contains nested Troop documents. This is the top-level document, embedding an array of troops. Troop documents contain nested Group and Course documents. Troops directly include groups and courses within them.

- Group and Course documents reference Scout documents. Instead of embedding scout details, they point to separate Scout documents for leaders, members, and participants.

- Scout documents are independent entities. They are in their own collection and are referenced by Group and Course.

## Plantuml

@startuml
interface ScoutHierarchy {
Troop: Troop[]
}

interface Group {
Name: string
Year: number
GroupLeader: Scout
Scouts: Scout[]
}

interface Scout {
Firstname: string
Lastname: string
Nickname: string
Badges: string[]
}

interface Troop {
Name: string
motto: string
groups: Group[]
availableCourse: Course[]
}

interface Course {
Name: string
Badge: string
Participants: Scout[]
}

ScoutHierarchy -- Troop
Troop -- Group
Group .. Scout
Group .. Scout
Troop -- Course
Course .. Scout
@enduml
