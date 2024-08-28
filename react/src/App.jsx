import { CalendarIcon, CheckBadgeIcon, CheckIcon, CircleStackIcon, ClockIcon, NoSymbolIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

const App = () => {
    const [boards, setBoards] = useState([
        {
            name: "Backlog",
            bg: "#DBF5DF",
            color: "#1DC337",
            icon: <CircleStackIcon className="size-6 text-[#1DC337]" />,
            cards: [
                { content: "Research project requirements" },
                { content: "Draft initial wireframes" },
                { content: "Prepare project proposal" },
            ]
        },
        {
            name: "Today",
            bg: "#FDECD6",
            color: "#F58B01",
            icon: <CalendarIcon className="size-6 text-[#F58B01]" />,
            cards: [
                { content: "Team meeting at 10 AM" },
                { content: "Finish UI design for homepage" },
                { content: "Review pull requests" },
            ]
        },
        {
            name: "Doing",
            bg: "#D6E8FD",
            color: "#0070F5",
            icon: <ClockIcon className="size-6 text-[#0070F5]" />,
            cards: [
                { content: "Develop user authentication module" },
                { content: "Implement responsive design for dashboard" },
            ]
        },
        {
            name: "Blocked",
            bg: "#F0E2F6",
            color: "#9F4CC8",
            icon: <NoSymbolIcon className="size-6 text-[#9F4CC8]" />,
            cards: [
                { content: "Waiting for API documentation" },
                { content: "Approval needed for design changes" },
            ]
        },
        {
            name: "Done",
            bg: "#D7F4F3",
            color: "#02BDB4",
            icon: <CheckBadgeIcon className="size-6 text-[#02BDB4]" />,
            cards: [
                { content: "Completed user registration flow" },
                { content: "Tested and deployed login functionality" },
            ]
        },
    ]);

    const [toggleForm, setToggleForm] = useState(boards.map(() => false));

    const [card, setCard] = useState(boards.map(() => ""));

    const inputRef = useRef([]);

    const createCard = (e, index) => {
        e.preventDefault();
        if (card[index].trim() !== '') {
            const updatedBoards = [...boards];
            updatedBoards[index].cards.push({ content: card[index] });
            setBoards(updatedBoards);
            setCard(card.map((c, i) => (i === index ? "" : c)))
            hideForm(index);
        }
    };

    const showForm = (index) => {
        setToggleForm(toggleForm.map((visible, i) => i === index ? true : visible));
    };

    const hideForm = (index) => {
        setToggleForm(toggleForm.map((visible, i) => i === index ? false : visible));
        setCard(card.map((c, i) => (i === index ? "" : c)));
    };

    useEffect(() => {
        toggleForm.forEach((isVisible, index) => {
            if (isVisible) {
                inputRef.current[index]?.focus();
            }
        });
    }, [toggleForm]);

    const [drag, setDrag] = useState(false);

    return (
        <div className="px-12 py-12 cursor-default">
            <div className="grid gap-4">
                <h1 className="text-5xl font-semibold text-black font-serif">Kanban Boards</h1>
                <p className="text-[#84848A] text-2xl font-sans">Enjoy project management and time.</p>
            </div>
            <div className="flex justify-between items-start gap-6 my-16">
                {boards.map((board, index) => (
                    <div key={board.name} className="grid gap-4 w-full">
                        <div className="flex items-center justify-between gap-4 font-serif">
                            <div style={{ backgroundColor: board.bg }} className="flex items-center gap-2 w-fit ps-2.5 pe-3 py-1 rounded-full">
                                {board.icon}
                                <h2 style={{ color: board.color }} className="font-semibold text-base">{board.name}</h2>
                            </div>
                            <span className="text-sm font-semibold" style={{ color: board.cards.length === 0 ? "#84848A" : board.color }}>{board.cards.length}</span>
                        </div>
                        <div className="grid gap-2">
                            {board.cards?.map((card) => (
                                <ul key={card.content}>
                                    <li className={`select-none bg-[#F5F5F7] border border-[#D6D6D6] px-4 py-2 rounded-lg ${drag ? "cursor-grabbing" : "cursor-grab"}`} onMouseDown={() => setDrag(true)} onMouseUp={() => setDrag(false)}>{card.content}</li>
                                </ul>
                            ))}
                            {toggleForm[index] ? (
                                <form onSubmit={(e) => createCard(e, index)} className="w-full">
                                    <textarea
                                        ref={(el) => inputRef.current[index] = el}
                                        value={card[index]}
                                        className="scroll-m-0 bg-white px-4 py-2 w-full rounded-lg text-black focus:outline-none"
                                        style={{ border: `1px solid ${board.color}` }}
                                        onChange={(e) => setCard(card.map((c, i) => (i === index ? e.target.value : c)))}
                                        placeholder="New card..."
                                    />
                                    <div className="flex items-center gap-4 justify-end">
                                        <button className="flex items-center gap-1 w-fit font-semibold text-sm text-[#84848A] hover:text-black" onClick={() => hideForm(index)}>Cancel</button>
                                        <button type="submit" className="flex items-center gap-1 w-fit font-semibold text-sm" style={{ color: board.color }}>
                                            <CheckIcon className="size-4" />Create
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button className="flex items-center gap-1 w-fit font-semibold text-sm" style={{ color: board.color }} onClick={() => showForm(index)}>
                                    <PlusIcon className="size-4" />Create
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
