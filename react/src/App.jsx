import { CalendarIcon, CheckBadgeIcon, CheckIcon, CircleStackIcon, ClockIcon, NoSymbolIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Reorder, motion } from "framer-motion"

const App = () => {
    const [boards, setBoards] = useState([
        {
            name: "Backlog",
            bg: "#D7F4F3",
            color: "#02BDB4",
            icon: <CircleStackIcon className="size-6 text-[#02BDB4]" />,
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
            bg: "#DBF5DF",
            color: "#1DC337",
            icon: <CheckBadgeIcon className="size-6 text-[#1DC337]" />,
            cards: [
                { content: "Completed user registration flow" },
                { content: "Tested and deployed login functionality" },
            ]
        },
    ]);

    const [toggleCreateForm, setToggleCreateForm] = useState(boards.map(() => false));
    const [toggleUpdateForm, setToggleUpdateForm] = useState(boards.map(() => null));

    const [cardOfCreate, setCardOfCreate] = useState(boards.map(() => ""));
    const [cardOfUpdate, setCardOfUpdate] = useState(boards.map(() => ""));

    const inputRef = useRef([]);
    const formRef = useRef([]);

    const createCard = (e, index) => {
        e.preventDefault();
        if (cardOfCreate[index].trim() !== '') {
            const updatedBoards = [...boards];
            updatedBoards[index].cards.push({ content: cardOfCreate[index] });
            setBoards(updatedBoards);
            setCardOfCreate(cardOfCreate.map((c, i) => (i === index ? "" : c)));
            hideCreateForm(index);
        }
    };

    const updateCard = (e, boardIndex, cardIndex) => {
        e.preventDefault();
        if (cardOfUpdate[boardIndex].trim() !== '') {
            const updatedBoards = [...boards];
            updatedBoards[boardIndex].cards[cardIndex].content = cardOfUpdate[boardIndex];
            setBoards(updatedBoards);
            setCardOfUpdate(cardOfUpdate.map((c, i) => (i === boardIndex ? "" : c)));
            hideUpdateForm(boardIndex);
        }
    };

    const showCreateForm = (index) => {
        setToggleCreateForm(toggleCreateForm.map((visible, i) => i === index ? true : visible));
    };

    const hideCreateForm = useCallback((index) => {
        setToggleCreateForm(toggleCreateForm.map((visible, i) => i === index ? false : visible));
        setCardOfCreate(cardOfCreate.map((c, i) => (i === index ? "" : c)));
    });

    const showUpdateForm = (boardIndex, cardIndex) => {
        setToggleUpdateForm(toggleUpdateForm.map((visible, i) => i === boardIndex ? cardIndex : visible));
        setCardOfUpdate(cardOfUpdate.map((c, i) => (i === boardIndex ? boards[boardIndex].cards[cardIndex].content : c)));
    };

    const hideUpdateForm = useCallback((index) => {
        setToggleUpdateForm(toggleUpdateForm.map((visible, i) => i === index ? null : visible));
        setCardOfUpdate(cardOfUpdate.map((c, i) => (i === index ? "" : c)));
    });

    useEffect(() => {
        toggleCreateForm.forEach((isVisible, index) => {
            if (isVisible) {
                inputRef.current[index]?.focus();
            }
        });

        toggleUpdateForm.forEach((cardIndex, boardIndex) => {
            if (cardIndex !== null) {
                inputRef.current[boardIndex]?.focus();
                inputRef.current[boardIndex].selectionStart = inputRef.current[boardIndex].selectionEnd = inputRef.current[boardIndex]?.value.length;
            }
        });
    }, [toggleCreateForm, toggleUpdateForm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            formRef.current.forEach((ref, index) => {
                if (toggleCreateForm[index] && ref && !ref.contains(event.target)) {
                    hideCreateForm(index);
                }
                if (toggleUpdateForm[index] !== null && ref && !ref.contains(event.target)) {
                    hideUpdateForm(index);
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [hideCreateForm, hideUpdateForm, toggleCreateForm, toggleUpdateForm]);

    const handleReorder = (newCards, boardIndex) => {
        const updatedBoards = [...boards];
        updatedBoards[boardIndex].cards = newCards;
        setBoards(updatedBoards);
    };

    return (
        <div className="px-12 py-12 cursor-default">
            <div className="grid gap-4">
                <h1 className="text-5xl font-semibold text-black font-serif">Kanban Board</h1>
                <p className="text-[#84848A] text-2xl font-sans">Enjoy real-time communication of capacity and full transparency of work.</p>
            </div>
            <div className="flex justify-between items-start gap-6 my-16 select-none">
                {boards.map((board, boardIndex) => (
                    <div key={board.name} className={`grid gap-4 w-full`}>
                        <div className="flex items-center justify-between gap-4 font-serif">
                            <div style={{ backgroundColor: board.bg }} className="flex items-center gap-2 w-fit ps-2.5 pe-3 py-1 rounded-full">
                                {board.icon}
                                <h2 style={{ color: board.color }} className="font-semibold text-base">{board.name}</h2>
                            </div>
                            <span className="text-sm font-semibold" style={{ color: board.cards.length === 0 ? "#84848A" : board.color }}>{board.cards.length}</span>
                        </div>
                        <Reorder.Group axis="y" className="grid gap-2" ref={(e) => formRef.current[boardIndex] = e} values={board.cards} onReorder={(newCards) => handleReorder(newCards, boardIndex)}>
                            {board.cards?.map((card, cardIndex) => (
                                <Reorder.Item
                                    key={card.content}
                                    value={card}
                                    drag
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    as={motion.div}
                                    transition={{ duration: 0 }}
                                >
                                    {toggleUpdateForm[boardIndex] !== cardIndex ? (
                                        <div onDoubleClick={() => showUpdateForm(boardIndex, cardIndex)} className={`bg-[#F5F5F7] border border-[#D6D6D6] px-4 py-2 rounded-lg`}>
                                            {card.content}
                                        </div>
                                    ) : (
                                        <form onSubmit={(e) => updateCard(e, boardIndex, cardIndex)} className="w-full">
                                            <textarea
                                                ref={(el) => inputRef.current[boardIndex] = el}
                                                rows={Math.ceil(cardOfUpdate[boardIndex].length / 26)}
                                                value={cardOfUpdate[boardIndex]}
                                                className="scroll-m-0 bg-white px-4 py-2 w-full rounded-lg text-black focus:outline-none"
                                                style={{ border: `1px solid ${board.color}` }}
                                                onChange={(e) => setCardOfUpdate(cardOfUpdate.map((c, i) => (i === boardIndex ? e.target.value : c)))}
                                                placeholder="Update..."
                                            />
                                            <div className="flex items-center gap-4 justify-end">
                                                <button type="button" className="flex items-center gap-1 w-fit font-semibold text-sm text-[#84848A] hover:text-black" onClick={() => hideUpdateForm(boardIndex)}>Cancel</button>
                                                <button type="submit" className="flex items-center gap-1 w-fit font-semibold text-sm" style={{ color: board.color }}>
                                                    <CheckIcon className="size-4" />Update
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Reorder.Item>
                            ))}
                            {toggleCreateForm[boardIndex] ? (
                                <form onSubmit={(e) => createCard(e, boardIndex)} className="w-full">
                                    <textarea
                                        ref={(el) => inputRef.current[boardIndex] = el}
                                        value={cardOfCreate[boardIndex]}
                                        className="scroll-m-0 bg-white px-4 py-2 w-full rounded-lg text-black focus:outline-none"
                                        style={{ border: `1px solid ${board.color}` }}
                                        onChange={(e) => setCardOfCreate(cardOfCreate.map((c, i) => (i === boardIndex ? e.target.value : c)))}
                                        placeholder="Create..."
                                    />
                                    <div className="flex items-center gap-4 justify-end">
                                        <button type="button" className="flex items-center gap-1 w-fit font-semibold text-sm text-[#84848A] hover:text-black" onClick={() => hideCreateForm(boardIndex)}>Cancel</button>
                                        <button type="submit" className="flex items-center gap-1 w-fit font-semibold text-sm" style={{ color: board.color }}>
                                            <CheckIcon className="size-4" />Create
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                toggleUpdateForm[boardIndex] === null && (
                                    <button className="flex items-center gap-1 w-fit font-semibold text-sm text-[#84848A]"
                                        onMouseEnter={(e) => e.target.style.color = board.color}
                                        onMouseLeave={(e) => e.target.style.color = "#84848A"}
                                        onClick={() => showCreateForm(boardIndex)}>
                                        <PlusIcon className="size-4" />Create
                                    </button>
                                )
                            )}
                        </Reorder.Group>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
