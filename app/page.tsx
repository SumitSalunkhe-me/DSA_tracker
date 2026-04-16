"use client";

import { useState, useEffect } from 'react';
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const curriculumData: Record<string, any[]> = {
  "DSA": [
    { 
      phase: "Phase 1: Mechanics", week: 1, title: "Arrays, Math & Bit Manipulation", focus: "Core aptitude. Modulo arithmetic, prime numbers, XOR operations.", 
      problems: [
        { title: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/", description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", hint: "Use a Hash Map to store the required difference as you iterate. O(n) time.", starterCode: "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    pass" },
        { title: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/", description: "Return true if any value appears at least twice in the array.", hint: "Convert the list to a set and compare lengths.", starterCode: "def containsDuplicate(self, nums: List[int]) -> bool:\n    pass" },
        { title: "Missing Number", difficulty: "Easy", link: "https://leetcode.com/problems/missing-number/" },
        { title: "Single Number", difficulty: "Easy", link: "https://leetcode.com/problems/single-number/" }
      ] 
    },
    { 
      phase: "Phase 1: Mechanics", week: 30, title: "Two Pointers", focus: "Moving from O(N²) loops to O(N) by converging from both sides.", 
      problems: [
        { title: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/", description: "Check if a string is a palindrome, ignoring non-alphanumeric characters.", hint: "Set a left pointer at 0 and right pointer at len(s)-1." },
        { title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
        { title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" },
        { title: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/" }
      ] 
    },
    { 
      phase: "Phase 1: Mechanics", week: 3, title: "Sliding Window", focus: "Maintaining a dynamic 'window' of data over an array.", 
      problems: [
        { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" }
      ] 
    },
    { 
      phase: "Phase 2: Logic", week: 4, title: "Hash Maps & Sets", focus: "O(1) lookups. Trading space complexity for massive time complexity gains.", 
      problems: [
        { title: "Valid Anagram", difficulty: "Easy" },
        { title: "Group Anagrams", difficulty: "Medium" },
        { title: "Top K Frequent Elements", difficulty: "Medium" },
        { title: "Longest Consecutive Sequence", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 2: Logic", week: 5, title: "Linked Lists", focus: "Pointer manipulation. Focus on the 'Tortoise and Hare' fast/slow pointer concept.", 
      problems: [
        { title: "Reverse Linked List", difficulty: "Easy" },
        { title: "Merge Two Sorted Lists", difficulty: "Easy" },
        { title: "Linked List Cycle", difficulty: "Easy" },
        { title: "Reorder List", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 2: Logic", week: 6, title: "Stacks & Queues", focus: "LIFO logic. Excellent for parsing strings or keeping track of previous states.", 
      problems: [
        { title: "Valid Parentheses", difficulty: "Easy" },
        { title: "Evaluate Reverse Polish Notation", difficulty: "Medium" },
        { title: "Min Stack", difficulty: "Medium" },
        { title: "Daily Temperatures", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 3: Hierarchies", week: 7, title: "Binary Trees & DFS", focus: "Plunging deep into a tree using recursion. Pre/In/Post-order traversal.", 
      problems: [
        { title: "Invert Binary Tree", difficulty: "Easy" },
        { title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
        { title: "Lowest Common Ancestor", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 3: Hierarchies", week: 8, title: "Binary Trees & BFS", focus: "Exploring trees layer by layer using a Queue to find shortest paths.", 
      problems: [
        { title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
        { title: "Binary Tree Right Side View", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 3: Hierarchies", week: 9, title: "Tries & Heaps", focus: "Advanced structural optimization. Tries for words, Heaps for dynamic max/min.", 
      problems: [
        { title: "Implement Trie", difficulty: "Medium" },
        { title: "Kth Largest Element in a Stream", difficulty: "Easy" },
        { title: "Merge K Sorted Lists", difficulty: "Hard" }
      ] 
    },
    { 
      phase: "Phase 4: Mapping", week: 10, title: "Graphs", focus: "Translating real-world connections into an Adjacency List or Matrix.", 
      problems: [
        { title: "Number of Islands", difficulty: "Medium" },
        { title: "Clone Graph", difficulty: "Medium" },
        { title: "Course Schedule", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 4: Mapping", week: 11, title: "1D Dynamic Programming", focus: "Breaking big problems into cached subproblems. Check -> Calc -> Save.", 
      problems: [
        { title: "Climbing Stairs", difficulty: "Easy" },
        { title: "House Robber", difficulty: "Medium" },
        { title: "Coin Change", difficulty: "Medium" },
        { title: "Longest Increasing Subsequence", difficulty: "Medium" }
      ] 
    },
    { 
      phase: "Phase 4: Mapping", week: 12, title: "Backtracking", focus: "Controlled DFS. Building incrementally and 'undoing' the last step.", 
      problems: [
        { title: "Subsets", difficulty: "Medium" },
        { title: "Permutations", difficulty: "Medium" },
        { title: "Combination Sum", difficulty: "Medium" },
        { title: "Word Search", difficulty: "Medium" }
      ] 
    }
  ],
  "AI / ML": [
    { 
      phase: "Phase 1: Foundations", week: 1, title: "Linear Algebra & NumPy", focus: "Vectors, matrices, and broadcasting in Python.", 
      problems: [
        { title: "Matrix Multiplication", difficulty: "Easy" },
        { title: "Broadcasting Rules", difficulty: "Medium" }
      ] 
    }
  ],
  "Web Dev": [
    { 
      phase: "Phase 1: Frontend", week: 1, title: "React Fundamentals", focus: "Components, Props, and State.", 
      problems: [
        { title: "Build a Counter", difficulty: "Easy" },
        { title: "Pass Props Down", difficulty: "Easy" }
      ] 
    }
  ]
};

const courses = Object.keys(curriculumData);

export default function Home() {
  const [activeCourse, setActiveCourse] = useState(courses[0]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [taskProgress, setTaskProgress] = useState<Record<number, boolean>>({});
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [statusOpacity, setStatusOpacity] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [notesTab, setNotesTab] = useState<'write' | 'preview'>('write');
  const [reviewsNeeded, setReviewsNeeded] = useState<Record<number, boolean>>({});
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const { isLoaded, isSignedIn, userId } = useAuth();

  const currentPlan = curriculumData[activeCourse] || curriculumData["DSA"];
  const activeData = currentPlan.find(w => w.week === activeWeek) || currentPlan[0];

  const handleCourseSwitch = (course: string) => {
    setActiveCourse(course);
    setActiveWeek(1);
    setExpandedTask(null);
    setNotes("");
    setTaskProgress({});
  };

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('dsa-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    window.localStorage.setItem('dsa-theme', theme);
  }, [theme]);

  const getProblemConcepts = (title: string) => {
    const normalized = title.toLowerCase();
    const topics: Record<string, string[]> = {
      'two sum': ['Hash map lookup', 'Array traversal', 'Complement search', 'Two-pointer setup', 'Index pairing'],
      'contains duplicate': ['Hash set', 'Duplicate detection', 'O(n) time', 'Data validation', 'Frequency counting'],
      'missing number': ['Arithmetic series', 'XOR trick', 'Set difference', 'Index sums', 'Missing element patterns'],
      'single number': ['XOR gates', 'Bitwise cancelation', 'Linear scan', 'Parity reasoning'],
      'valid palindrome': ['Two pointers', 'String normalization', 'Alphanumeric filtering', 'Case folding'],
      '3sum': ['Sorting + two pointers', 'Duplicate skipping', 'Triplet combination', 'Array partitioning'],
      'container with most water': ['Two-pointer technique', 'Greedy width-height', 'Max area', 'Array boundaries'],
      'trapping rain water': ['Water volume', 'Two pointers', 'Stack / elevation logic', 'Height profiling'],
      'valid anagram': ['Character counts', 'Hash maps', 'String comparison', 'Frequency maps'],
      'group anagrams': ['Signature sorting', 'Hash map grouping', 'String buckets', 'Canonical forms'],
      'top k frequent elements': ['Frequency map', 'Min-heap', 'Bucket sort', 'Counting frequencies'],
      'longest consecutive sequence': ['Hash set lookup', 'Sequence expansion', 'O(n) scanning', 'Consecutive runs'],
      'reverse linked list': ['Pointer reversal', 'Iterative vs recursive', 'In-place transform', 'Node linking'],
      'merge two sorted lists': ['Dummy node pattern', 'Sorted merge', 'List traversal', 'Two-list merge'],
      'linked list cycle': ['Fast/slow pointers', 'Cycle detection', 'Floyd’s algorithm', 'Linked list visitation'],
      'valid parentheses': ['Stack usage', 'Matching pairs', 'Syntax validation', 'Bracket nesting'],
      'evaluate reverse polish notation': ['Stack evaluation', 'Operator order', 'Postfix notation', 'Expression parsing'],
      'min stack': ['Auxiliary stack', 'Constant time min', 'Stack invariants', 'Space tracking'],
      'daily temperatures': ['Monotonic stack', 'Next greater element', 'Temperature span', 'Future lookup'],
      'invert binary tree': ['Recursion', 'Swap children', 'DFS traversal', 'Tree symmetry'],
      'maximum depth of binary tree': ['Tree height', 'DFS / BFS', 'Recursive depth', 'Level counting'],
      'lowest common ancestor': ['Binary tree traversal', 'Path comparison', 'Divide and conquer', 'Ancestor tracking'],
      'binary tree level order traversal': ['BFS queue', 'Layer-by-layer', 'Tree levels', 'Breadth-first search'],
      'binary tree right side view': ['Level order', 'Visibility by depth', 'Queue processing', 'Right-side projection'],
      'implement trie': ['Prefix tree', 'Trie nodes', 'Character branching', 'String prefixes'],
      'kth largest element in a stream': ['Heaps', 'Sliding window', 'Stream processing', 'Online selection'],
      'merge k sorted lists': ['Divide and conquer', 'Heap merge', 'Linked list merge', 'Multiple list merge'],
      'number of islands': ['DFS / BFS', 'Grid traversal', 'Connected components', 'Flood fill'],
      'clone graph': ['Graph traversal', 'DFS/BFS', 'Deep copy', 'Node cloning'],
      'course schedule': ['Topological sort', 'DAG', 'Dependency graph', 'Order constraints'],
      'climbing stairs': ['Fibonacci sequence', 'Dynamic programming', 'State transitions', 'Step recursion'],
      'house robber': ['DP with constraints', 'Choose vs skip', 'Optimal substructure', 'Adjacent choices'],
      'coin change': ['Unbounded knapsack', 'DP tabulation', 'Subproblem reuse', 'Combination sums'],
      'longest increasing subsequence': ['Patience sorting', 'DP + binary search', 'Subsequence tracking', 'Sequence optimization'],
      'subsets': ['Backtracking', 'Bit masking', 'Subset generation', 'Combination enumeration'],
      'permutations': ['DFS recursion', 'Swap technique', 'Backtracking', 'Order generation'],
      'combination sum': ['Backtracking', 'Sum pruning', 'Sorted candidates', 'Target decomposition'],
      'word search': ['DFS grid search', 'Visited tracking', 'Prefix pruning', 'Board traversal'],
      'matrix multiplication': ['2D arrays', 'Row/column iteration', 'Dot product', 'Matrix arithmetic'],
      'broadcasting rules': ['Numpy broadcasting', 'Shape alignment', 'Element-wise ops', 'Array expansion'],
      'build a counter': ['React state', 'Event handling', 'Component updates', 'UI interactivity'],
      'pass props down': ['React props', 'Component hierarchy', 'Data flow', 'Reusable UI components'],
      'array': ['Array fundamentals', 'Indexing', 'Iteration patterns', 'Subarray thinking', 'In-place modifications'],
      'string': ['String traversal', 'Substring matching', 'Character encoding', 'Normalization', 'Two-pointer strings'],
      'graph': ['Adjacency lists', 'BFS / DFS', 'Weights vs unweighted', 'Cycle detection'],
      'tree': ['Rooted trees', 'DFS / BFS', 'Recursive traversal', 'Height and depth'],
      'linked list': ['Node pointers', 'Head/tail handling', 'In-place reversal', 'Cycle detection'],
      'stack': ['LIFO structure', 'Push/pop', 'Expression evaluation', 'Monotonic patterns'],
      'queue': ['FIFO structure', 'Level order', 'Sliding window', 'Buffering'],
      'heap': ['Priority queues', 'Heapify', 'Kth element', 'Min/max access'],
      'dynamic programming': ['Memoization', 'Tabulation', 'State definition', 'Overlapping subproblems'],
      'backtracking': ['Recursive search', 'Pruning', 'Constraint propagation', 'Path exploration']
    };

    return Object.entries(topics).find(([key]) => normalized.includes(key))?.[1] || ['Array fundamentals', 'Pattern recognition', 'Time/space tradeoffs', 'Edge case handling'];
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (!activeData) return;
    async function loadCloudData() {
      if (!userId) return;
      const { data: taskData } = await supabase.from('user_progress').select('task_index, is_completed').eq('user_id', userId).eq('course_name', activeCourse).eq('week_num', activeWeek);
      const cloudTasks: Record<number, boolean> = {};
      taskData?.forEach(row => { cloudTasks[row.task_index] = row.is_completed; });
      setTaskProgress(cloudTasks);

      const { data: notesData } = await supabase.from('user_notes').select('notes_text').eq('user_id', userId).eq('course_name', activeCourse).eq('week_num', activeWeek).maybeSingle();
      if (notesData?.notes_text) setNotes(notesData.notes_text);
    }
    if (isSignedIn && userId) loadCloudData();
  }, [activeWeek, activeCourse, isSignedIn, userId]);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const localKey = `${activeCourse}_w${activeWeek}_notes`;
      const savedNote = localStorage.getItem(localKey) || "";
      if (notes !== savedNote && notes !== "") {
        localStorage.setItem(localKey, notes);
        if (isSignedIn && userId) {
          await supabase.from('user_notes').upsert({ user_id: userId, course_name: activeCourse, week_num: activeWeek, notes_text: notes }, { onConflict: 'user_id, course_name, week_num' });
        }
        setStatusOpacity(1);
        setTimeout(() => setStatusOpacity(0), 2000);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes, activeWeek, activeCourse, isSignedIn, userId]);

  const toggleTask = async (index: number) => {
    const newVal = !taskProgress[index];
    setTaskProgress(prev => ({ ...prev, [index]: newVal }));
    if (isSignedIn && userId) {
      await supabase.from('user_progress').upsert({ user_id: userId, course_name: activeCourse, week_num: activeWeek, task_index: index, is_completed: newVal }, { onConflict: 'user_id, course_name, week_num, task_index' });
    }
  };

  const handleSpacedRepetition = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setReviewsNeeded(prev => ({ ...prev, [index]: true }));
    alert("Added to Spaced Repetition Engine! We will remind you to re-solve this in 3 days.");
  };

  const totalTasks = activeData?.problems.length || 0;
  const completedTasks = Object.values(taskProgress).filter(Boolean).length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const groupedPlan = currentPlan.reduce((acc: any, curr: any) => {
    if (!acc[curr.phase]) acc[curr.phase] = [];
    acc[curr.phase].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  const mockHeatmap = [0, 1, 0, 2, 1, 3, 0, 0, 1, 2, 3, 2, 1, 0, 1, 2, 0, 0, 1, 3, 2, 1, 0, 2, 3, 1, 0, 1, 2, 0, 1, 3, 2, 0, 1, 2, 1, 0, 3, 2, 1, 0, 0, 1, 2, 3, 1, 0, 1, 2, 0, 1, 2, 3, 2, 1, 0, 1, 2, 0];

  return (
    <div className="app-container">
      <div className="top-slider">
        {courses.map(course => (
          <div key={course} className={`course-tab ${activeCourse === course ? 'active' : ''}`} onClick={() => handleCourseSwitch(course)}>
            {course}
          </div>
        ))}
        <div className="top-slider-controls">
          <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
          {!isLoaded ? null : !isSignedIn ? (
            <SignInButton mode="modal"><button className="menu-btn" style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '6px 12px' }}>Sign In</button></SignInButton>
          ) : <UserButton />}
        </div>
      </div>

      <div className="workspace">
        <div className={`overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

        <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">{activeCourse} PATH</div>
          {Object.entries(groupedPlan).map(([phase, weeks]: any) => (
            <div key={phase}>
              <div className="nav-group">{phase}</div>
              <div className="timeline-container">
                <div className="timeline-line"></div>
                {weeks.map((data: any) => (
                  <div key={data.week} className={`timeline-item ${activeWeek === data.week ? 'active' : ''}`} onClick={() => {setActiveWeek(data.week); setExpandedTask(null); setIsMobileMenuOpen(false);}}>
                    <div className="timeline-dot"></div>
                    Week {data.week}: {data.title.split(',')[0]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="main-content">
          <div className="content-wrapper">
            <div className="mobile-header" style={{ marginBottom: '20px', display: isMobileMenuOpen ? 'none' : '' }}>
              <button className="menu-btn" onClick={() => setIsMobileMenuOpen(true)}>☰ Menu</button>
            </div>

            <div className="dashboard-grid">
              <div className="heatmap-card">
                <div className="section-title" style={{marginBottom: '5px'}}>Consistency Heatmap</div>
                <div style={{fontSize: '12px', color: 'var(--text-dim)'}}>14 Day Streak! Keep building neural pathways.</div>
                <div className="heatmap-grid">
                  {mockHeatmap.map((level, i) => <div key={i} className={`heat-box level-${level}`}></div>)}
                </div>
              </div>
              <div className="feed-card">
                <div className="section-title">Live Friend Feed</div>
                <div className="feed-item"><div className="feed-avatar">S</div><div className="feed-text"><strong>Soham</strong> conquered <em>Two Sum</em>.</div></div>
                <div className="feed-item"><div className="feed-avatar" style={{background: 'var(--success)'}}>A</div><div className="feed-text"><strong>Ayush</strong> started <em>Sliding Window</em>.</div></div>
              </div>
            </div>

            <div className="header-badge">WEEK {activeData?.week}</div>
            <h1 className="week-title">{activeData?.title}</h1>
            <p className="week-focus">{activeData?.focus}</p>

            <div className="progress-container">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="section-title">Execution Modules</div>
            <div className="task-list">
              
              {activeData?.problems.map((prob: any, index: number) => (
                <div key={index} className="task-wrapper">
                  
                  <div className="task-header-row" onClick={() => setExpandedTask(expandedTask === index ? null : index)}>
                    <input 
                      type="checkbox" 
                      className="task-checkbox" 
                      checked={taskProgress[index] || false} 
                      onChange={(e) => { e.stopPropagation(); toggleTask(index); }} 
                    />
                    
                    <div className="task-info-group">
                      <span className="task-name" style={{ textDecoration: taskProgress[index] ? 'line-through' : 'none', color: taskProgress[index] ? 'var(--text-dim)' : '#fff' }}>
                        {prob.title}
                      </span>
                      {prob.difficulty && (
                        <span className={`difficulty-badge diff-${prob.difficulty.toLowerCase()}`}>
                          {prob.difficulty}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        className="learn-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTask(index);
                        }}
                      >
                        📘 Learn more
                      </button>
                      {!taskProgress[index] && !reviewsNeeded[index] && (
                        <button className="rep-btn" onClick={(e) => handleSpacedRepetition(e, index)}>🧠 Review Later</button>
                      )}
                      {reviewsNeeded[index] && <span style={{fontSize: '12px', color: 'var(--warning)'}}>Queued</span>}
                    </div>
                  </div>

                  {expandedTask === index && (
                    <div className="task-details-drawer">
                      
                      {prob.description && (
                        <div>
                          <div className="detail-section-title">Mission Briefing</div>
                          <div className="problem-desc">{prob.description}</div>
                        </div>
                      )}

                      {prob.hint && (
                        <div className="hint-box"><strong>💡 Neural Hint:</strong> {prob.hint}</div>
                      )}

                      {prob.starterCode && (
                        <div>
                          <div className="detail-section-title">Starter Template</div>
                          <div className="code-snippet">{prob.starterCode}</div>
                        </div>
                      )}

                      <div className="detail-section-title">Learn More</div>
                      <div className="learn-more-list">
                        {getProblemConcepts(prob.title).map((concept) => (
                          <span key={concept} className="learn-more-chip">{concept}</span>
                        ))}
                      </div>

                      {prob.link ? (
                        <div className="action-bar">
                          <a href={prob.link} target="_blank" rel="noopener noreferrer" className="solve-btn">
                            Solve on LeetCode ↗
                          </a>
                        </div>
                      ) : (
                         <div style={{fontSize: '12px', color: 'var(--text-dim)'}}>
                           (No LeetCode link provided for this challenge yet)
                         </div>
                      )}

                    </div>
                  )}

                </div>
              ))}
            </div>

            <div className="section-title">Execution Notes & Autopsy</div>
            <div className="md-tabs">
              <button className={`md-tab ${notesTab === 'write' ? 'active' : ''}`} onClick={() => setNotesTab('write')}>Write</button>
              <button className={`md-tab ${notesTab === 'preview' ? 'active' : ''}`} onClick={() => setNotesTab('preview')}>Preview Markdown</button>
            </div>
            {notesTab === 'write' ? (
              <textarea className="notes-area" placeholder="Use Markdown here! e.g. **Bold**, `code blocks`, or bullet points..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            ) : (
              <div className="md-preview">{notes ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown> : <span style={{color: 'var(--text-dim)'}}>Nothing to preview. Start typing...</span>}</div>
            )}
            <div className="save-status" style={{ opacity: statusOpacity }}>Autosaved to cloud storage ✓</div>
          </div>
        </div>
      </div>
    </div>
  );
}