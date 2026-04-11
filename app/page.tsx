"use client";

import { useState, useEffect } from 'react';

const dsaPlan = [
  { phase: "Phase 1: Mechanics", week: 1, title: "Arrays, Math & Bit Manipulation", focus: "Core aptitude. Modulo arithmetic, prime numbers, XOR operations, and understanding continuous memory layout.", problems: ["Two Sum", "Contains Duplicate", "Missing Number", "Single Number"] },
  { phase: "Phase 1: Mechanics", week: 2, title: "Two Pointers", focus: "Moving from O(N²) loops to O(N) by converging from both sides or moving at different speeds.", problems: ["Valid Palindrome", "3Sum", "Container With Most Water", "Trapping Rain Water"] },
  { phase: "Phase 1: Mechanics", week: 3, title: "Sliding Window", focus: "Maintaining a dynamic 'window' of data over an array to find optimal contiguous subsections.", problems: ["Best Time to Buy and Sell Stock", "Longest Substring Without Repeating Characters", "Longest Repeating Character Replacement"] },
  { phase: "Phase 2: Logic", week: 4, title: "Hash Maps & Sets", focus: "O(1) lookups. Trading space complexity for massive time complexity gains.", problems: ["Valid Anagram", "Group Anagrams", "Top K Frequent Elements", "Longest Consecutive Sequence"] },
  { phase: "Phase 2: Logic", week: 5, title: "Linked Lists", focus: "Pointer manipulation. Focus on the 'Tortoise and Hare' fast/slow pointer concept.", problems: ["Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle", "Reorder List"] },
  { phase: "Phase 2: Logic", week: 6, title: "Stacks & Queues", focus: "LIFO logic. Excellent for parsing strings or keeping track of previous states.", problems: ["Valid Parentheses", "Evaluate Reverse Polish Notation", "Min Stack", "Daily Temperatures"] },
  { phase: "Phase 3: Hierarchies", week: 7, title: "Binary Trees & DFS", focus: "Plunging deep into a tree using recursion. Understanding Pre/In/Post-order traversal.", problems: ["Invert Binary Tree", "Maximum Depth of Binary Tree", "Lowest Common Ancestor"] },
  { phase: "Phase 3: Hierarchies", week: 8, title: "Binary Trees & BFS", focus: "Exploring trees layer by layer using a Queue to find shortest paths.", problems: ["Binary Tree Level Order Traversal", "Binary Tree Right Side View"] },
  { phase: "Phase 3: Hierarchies", week: 9, title: "Tries & Heaps", focus: "Advanced structural optimization. Tries for word searches, Heaps for dynamic max/min tracking.", problems: ["Implement Trie", "Kth Largest Element in a Stream", "Merge K Sorted Lists"] },
  { phase: "Phase 4: Mapping", week: 10, title: "Graphs", focus: "Translating real-world connections into an Adjacency List or Matrix.", problems: ["Number of Islands", "Clone Graph", "Course Schedule (Cycle Detection)"] },
  { phase: "Phase 4: Mapping", week: 11, title: "1D Dynamic Programming", focus: "Breaking big problems into cached subproblems. The Check -> Calculate -> Save -> Return pattern.", problems: ["Climbing Stairs", "House Robber", "Coin Change", "Longest Increasing Subsequence"] },
  { phase: "Phase 4: Mapping", week: 12, title: "Backtracking", focus: "Controlled DFS. Building a solution incrementally and 'undoing' the last step if it hits a dead end.", problems: ["Subsets", "Permutations", "Combination Sum", "Word Search"] }
];

export default function Home() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [taskProgress, setTaskProgress] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const [statusOpacity, setStatusOpacity] = useState(0);

  // Load data from localStorage when the week changes
  useEffect(() => {
    const activeData = dsaPlan.find(w => w.week === activeWeek);
    if (!activeData) return;

    const loadedTasks: Record<number, boolean> = {};
    activeData.problems.forEach((_, index) => {
      loadedTasks[index] = localStorage.getItem(`w${activeWeek}_task${index}`) === 'true';
    });
    setTaskProgress(loadedTasks);
    setNotes(localStorage.getItem(`w${activeWeek}_notes`) || "");
  }, [activeWeek]);

  // Autosave notes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const savedNote = localStorage.getItem(`w${activeWeek}_notes`) || "";
      if (notes !== savedNote) {
        localStorage.setItem(`w${activeWeek}_notes`, notes);
        setStatusOpacity(1);
        setTimeout(() => setStatusOpacity(0), 2000);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes, activeWeek]);

  const toggleTask = (index: number) => {
    const newVal = !taskProgress[index];
    setTaskProgress(prev => ({ ...prev, [index]: newVal }));
    localStorage.setItem(`w${activeWeek}_task${index}`, String(newVal));
  };

  const activeData = dsaPlan.find(w => w.week === activeWeek);
  let currentPhase = "";

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">Neural Path DSA</div>
        {dsaPlan.map((data) => {
          let phaseHeader = null;
          if (data.phase !== currentPhase) {
            phaseHeader = <div key={`phase-${data.phase}`} className="nav-group">{data.phase}</div>;
            currentPhase = data.phase;
          }
          return (
            <div key={data.week}>
              {phaseHeader}
              <div 
                className={`nav-item ${activeWeek === data.week ? 'active' : ''}`}
                onClick={() => setActiveWeek(data.week)}
              >
                Week {data.week}: {data.title.split(',')[0]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          <div className="header-badge">WEEK {activeData?.week}</div>
          <h1 className="week-title">{activeData?.title}</h1>
          <p className="week-focus">{activeData?.focus}</p>

          <div className="section-title">Execution Checklist</div>
          <div className="task-list">
            {activeData?.problems.map((prob, index) => (
              <label key={index} className="task-card">
                <input 
                  type="checkbox" 
                  className="task-checkbox" 
                  checked={taskProgress[index] || false}
                  onChange={() => toggleTask(index)}
                />
                <span className="task-name">{prob}</span>
              </label>
            ))}
          </div>

          <div className="section-title">Execution Notes & Autopsy</div>
          <textarea 
            className="notes-area" 
            placeholder="Paste your dry-runs, failed approaches, and time/space complexity notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="save-status" style={{ opacity: statusOpacity }}>
            Autosaved to browser storage ✓
          </div>
        </div>
      </div>
    </>
  );
}