"use client";

import { useState, useEffect } from 'react';
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Grab the User ID directly from Clerk Auth
  const { isLoaded, isSignedIn, userId } = useAuth();

  // Load Data (Cloud if logged in, Local Storage if not)
  useEffect(() => {
    const activeData = dsaPlan.find(w => w.week === activeWeek);
    if (!activeData) return;

    async function loadCloudData() {
      if (!userId) return;
      
      // 1. Fetch Task Progress
      const { data: taskData, error: taskError } = await supabase
        .from('user_progress')
        .select('task_index, is_completed')
        .eq('user_id', userId)
        .eq('week_num', activeWeek);

      if (taskError) console.error("Error fetching tasks:", taskError);

      const cloudTasks: Record<number, boolean> = {};
      taskData?.forEach(row => {
        cloudTasks[row.task_index] = row.is_completed;
      });
      setTaskProgress(cloudTasks);

      // 2. Fetch Cloud Notes
      const { data: notesData, error: notesError } = await supabase
        .from('user_notes')
        .select('notes_text')
        .eq('user_id', userId)
        .eq('week_num', activeWeek)
        .maybeSingle(); // Gets one row safely

      if (notesError) console.error("Error fetching notes:", notesError);
      
      // If we have cloud notes, load them. Otherwise, check local storage.
      if (notesData?.notes_text) {
        setNotes(notesData.notes_text);
      } else {
        setNotes(localStorage.getItem(`w${activeWeek}_notes`) || "");
      }
    }

    if (isSignedIn && userId) {
      loadCloudData();
    } else {
      const loadedTasks: Record<number, boolean> = {};
      activeData.problems.forEach((_, index) => {
        loadedTasks[index] = localStorage.getItem(`w${activeWeek}_task${index}`) === 'true';
      });
      setTaskProgress(loadedTasks);
      setNotes(localStorage.getItem(`w${activeWeek}_notes`) || "");
    }
  }, [activeWeek, isSignedIn, userId]);

  // Autosave notes to Cloud
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const savedNote = localStorage.getItem(`w${activeWeek}_notes`) || "";
      
      // Only fire a save if the text actually changed
      if (notes !== savedNote) {
        localStorage.setItem(`w${activeWeek}_notes`, notes); // Save local backup
        
        // Save directly to cloud if logged in
        if (isSignedIn && userId) {
          const { error } = await supabase
            .from('user_notes')
            .upsert({
              user_id: userId,
              week_num: activeWeek,
              notes_text: notes
            }, { onConflict: 'user_id, week_num' });
            
          if (error) console.error("Error saving notes to cloud:", error);
        }

        // Show the success checkmark
        setStatusOpacity(1);
        setTimeout(() => setStatusOpacity(0), 2000);
      }
    }, 1000); // Waits 1 second after you stop typing to save
    return () => clearTimeout(timeoutId);
  }, [notes, activeWeek, isSignedIn, userId]);

  // The Checkbox Toggle Function
  const toggleTask = async (index: number) => {
    const newVal = !taskProgress[index];
    setTaskProgress(prev => ({ ...prev, [index]: newVal }));

    if (isSignedIn && userId) {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          week_num: activeWeek,
          task_index: index,
          is_completed: newVal
        }, { onConflict: 'user_id, week_num, task_index' });
        
      if (error) console.error("Error saving to cloud:", error);
    } else {
      localStorage.setItem(`w${activeWeek}_task${index}`, String(newVal));
    }
  };

  const selectWeek = (week: number) => {
    setActiveWeek(week);
    setIsMobileMenuOpen(false);
  };

  const activeData = dsaPlan.find(w => w.week === activeWeek);
  let currentPhase = "";

  return (
    <>
      <div 
        className={`overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
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
                onClick={() => selectWeek(data.week)}
              >
                Week {data.week}: {data.title.split(',')[0]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="main-content">
        <div className="content-wrapper">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <div className="mobile-header" style={{ marginBottom: 0, display: isMobileMenuOpen ? 'none' : '' }}>
                <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>☰ Menu</button>
              </div>
              <div className="header-badge" style={{ display: 'inline-block', margin: 0 }}>WEEK {activeData?.week}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {!isLoaded ? null : !isSignedIn ? (
                <SignInButton mode="modal">
                  <button className="menu-btn" style={{ background: 'var(--primary)', color: '#000', border: 'none' }}>
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <UserButton />
              )}
            </div>
          </div>

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
            Autosaved to cloud storage ✓
          </div>
        </div>
      </div>
    </>
  );
}