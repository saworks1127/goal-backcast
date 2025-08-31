import {useMemo, useRef, useState} from 'react';
import {useAppStore} from './store';
import type {Goal, Task, TaskStatus} from './types';

export const App = () => {
    const goals = useAppStore((s) => s.goals);
    const tasks = useAppStore((s) => s.tasks);
    return (
        <div style={{maxWidth: 920, margin: '24px auto', padding: '0 16px', lineHeight: 1.6}}>
            <h1>Goal Backcast — Lv1</h1>
            <p style={{color: '#555'}}>Goalを作成 → Taskをぶら下げ → チェックで即時反映（Zustand・メモリのみ）</p>
            <section style={{marginTop: 24}}>
                <h2>New Goal</h2>
                <GoalForm/>
            </section>

            <section style={{marginTop: 24}}>
                <h2>Goals</h2>
                {goals.length === 0 ? (
                    <p style={{color: '#777'}}>まだGoalがありません。上のフォームから作成してください。</p>
                ) : (
                    goals.map((g) => <GoalCard key={g.id} goal={g} allTasks={tasks}/>)
                )}
            </section>
        </div>
    );
}

function GoalForm() {
    const addGoal = useAppStore((s) => s.addGoal);
    const [title, setTitle] = useState('')
    const [done, setDone] = useState('');
    const titleRef = useRef<HTMLInputElement>(null);

    const canSave = title.trim().length > 0 && done.trim().length > 0;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSave) return;
        addGoal({title: title.trim(), doneCriteria: done.trim()});
        setTitle('');
        setDone('');
        titleRef.current?.focus();
    };
    return (
        <form onSubmit={onSubmit} style={cardStyle}>
            <label style={labelStyle}>Title</label>
            <input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)}
                   placeholder="例: AWS移行v1を完了" style={inputStyle}/>

            <label style={labelStyle}>Done Criteria（完了条件 / 必須）</label>
            <input value={done} onChange={(e) => setDone(e.target.value)}
                   placeholder="例: 本番EC2でアプリ稼働・DNS切替済み" style={inputStyle}/>

            <button type="submit" disabled={!canSave} style={{...buttonStyle, opacity: canSave ? 1 : 0.5}}>
                Save Goal
            </button>
        </form>
    );
}

function GoalCard({goal, allTasks}: { goal: Goal, allTasks: Task[] }) {
    const removeGoal = useAppStore((s) => s.removeGoal);
    const addTask = useAppStore((s) => s.addTask);
    const tasks = useMemo(() => allTasks.filter((t) => t.goalId === goal.id), [allTasks, goal.id]);

    const onAddTask = () => {
        const title = prompt('Task title?');
        if (!title) return;
        addTask(goal.id, title.trim());
    };

    return (
        <div style={cardStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <div style={{fontWeight: 700}}>{goal.title}</div>
                    <div style={{color: '#666', fontSize: 14}}>Done when: {goal.doneCriteria}</div>
                </div>
                <div>
                    <button onClick={onAddTask} style={buttonStyle}>+ Task</button>
                    <button onClick={() => removeGoal(goal.id)}
                            style={{...buttonStyle, marginLeft: 8, background: '#eee'}}>Delete
                    </button>
                </div>
            </div>

            <ul style={{marginTop: 8, paddingLeft: 20}}>
                {tasks.length === 0 ? (
                    <li style={{color: '#888'}}>まだTaskがありません</li>) : (
                    tasks.map((t) => <TaskItem key={t.id} task={t}/>)
                )}
            </ul>
        </div>
    );
}

function TaskItem({task}: { task: Task }) {
    const setTaskStatus = useAppStore((s) => s.setTaskStatus);
    const toggleTaskDone = useAppStore((s) => s.toggleTaskDone);

    const cycle = (s: TaskStatus): TaskStatus => (s === 'Todo' ? 'Doing' : s === 'Doing' ? 'Done' : 'Todo');

    return (
        <li style={{display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0'}}>
            <input type="checkbox" checked={task.status === 'Done'} onChange={() => toggleTaskDone(task.id)}/>
            <span style={{textDecoration: task.status === 'Done' ? 'line-through' : 'none'}}>{task.title}</span>
            <select
                value={task.status}
                onChange={(e) => setTaskStatus(task.id, e.target.value as TaskStatus)}
                style={{marginLeft: 'auto'}}
                title="Todo / Doing / Done を切替"
            >
                <option>Todo</option>
                <option>Doing</option>
                <option>Done</option>
            </select>
            <button onClick={() => setTaskStatus(task.id, cycle(task.status))}
                    style={{...buttonStyle, padding: '4px 8px'}}>
                Cycle
            </button>
        </li>
    );
}

const cardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    background: '#fff',
};
const labelStyle: React.CSSProperties = { display: 'block', marginTop: 8, marginBottom: 4, fontWeight: 600 };
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
};
const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#f8fafc',
    cursor: 'pointer',
};

export default App;