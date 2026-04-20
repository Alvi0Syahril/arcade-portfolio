export interface SolidCaseStudy {
  id: string;
  title: string;
  description: string;
  principle: string;
  violation: {
    description: string;
    code: string;
  };
  solution: {
    description: string;
    code: string;
  };
}

export const solidCaseStudies: SolidCaseStudy[] = [
  {
    id: "delivery-management",
    title: "Delivery Management System",
    description: "Monitoring energy usage for motorized vs. non-motorized deliveries.",
    principle: "LSP (Liskov Substitution Principle)",
    violation: {
      description: "Forcing 'energyCount()' on a Bicycle (Sepeda) which doesn't use fuel/electricity.",
      code: `abstract class Delivery {
    public abstract deliveryDetail(): void;
    // WRONG: Forced behavior for all deliveries
    public abstract energyCount(): void; 
}

class Sepeda extends Delivery {
    public deliveryDetail() {
        console.log("Bicycle Delivery: Short distance.");
    }

    public energyCount() {
        // LSP Violation: Subtype cannot fulfill supertype behavior
        throw new Error("UnsupportedOperation: Bicycles don't use fuel!");
    }
}`
    },
    solution: {
      description: "Segregating behaviors with interfaces. Only motorized vehicles implement EnergyTrackable.",
      code: `abstract class Delivery {
    public abstract deliveryDetail(): void;
}

interface EnergyTrackable {
    energyCount(): void;
}

class Motor extends Delivery implements EnergyTrackable {
    public deliveryDetail() {
        console.log("Motor Delivery: Handling heavy packages.");
    }

    public energyCount() {
        console.log("Calculating fuel consumption.");
    }
}

class Sepeda extends Delivery {
    public deliveryDetail() {
        console.log("Bicycle Delivery: Short distance.");
    }
    // No energyCount required!
}`
    }
  },
  {
    id: "coding-camp-curriculum",
    title: "Coding Camp Curriculum",
    description: "Organizing specialized subjects into custom roadmaps.",
    principle: "ISP & Subclass Refinement",
    violation: {
      description: "A single Curriculum class containing every subject, forcing students to learn irrelevant topics.",
      code: `class Curriculum {
    learnMath() { /* ... */ }
    learnAlgorithm() { /* ... */ }
    // Forced subjects for everyone
    learnJava() { /* ... */ }
    learnPyTorch() { /* ... */ }
    learnR() { /* ... */ }
}`
    },
    solution: {
      description: "Base class contains 'Common Core' subjects; specialized roadmaps handle their own topics.",
      code: `abstract class Curriculum {
    learnMath() { console.log("Learning fundamental Math."); }
    learnAlgorithm() { console.log("Learning Basic Algorithms."); }
}

class SoftwareEngineering extends Curriculum {
    learnJava() { console.log("SE: Learning Java for Enterprise."); }
    learnWeb() { console.log("SE: Learning Web (HTML/CSS/JS)."); }
}

class DataScience extends Curriculum {
    learnStatistic() { console.log("DS: Learning Advanced Statistics."); }
    learnR() { console.log("DS: Learning R Programming."); }
}`
    }
  }
];
