import { GripVertical, Plus } from "lucide-react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { Label } from "./ui/label";
import { OptionPOJO } from "@/db/models/poll";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CSS } from "@dnd-kit/utilities";

interface PollOptionsProps {
    options: OptionPOJO[];
    updateOptions: (options: OptionPOJO[]) => void;
    handleOptionTextChange: (text: string, currentIndex: number) => void;
    addOption: () => void;
}

export default function PollOptions({
    options,
    handleOptionTextChange,
    addOption,
    updateOptions,
}: PollOptionsProps) {
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oldIndex = +active.id;
            const newIndex = +over.id;
            console.log(oldIndex, newIndex);
            updateOptions(arrayMove(options, oldIndex, newIndex));
        }
    };

    return (
        <div className="space-y-4">
            <Label>Options</Label>
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={options}>
                    {options.map((option, index) => (
                        <Option
                            option={option}
                            index={index}
                            handleOptionTextChange={handleOptionTextChange}
                            key={index}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <Button onClick={addOption} type="button">
                <Plus className="size-4" /> Add Option
            </Button>
        </div>
    );
}

interface OptionProps {
    option: OptionPOJO;
    index: number;
    handleOptionTextChange: (text: string, currentIndex: number) => void;
}

function Option({ option, index, handleOptionTextChange }: OptionProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div key={index} className="relative" style={style} ref={setNodeRef}>
            <Label
                htmlFor={`option-${index}`}
                className="sr-only"
            >{`option-${index}`}</Label>
            <Input
                id={`option-${index}`}
                name="option"
                value={option.optionText}
                onChange={(e) => handleOptionTextChange(e.target.value, index)}
                className="pl-6"
            />
            <div
                className="absolute inset-y-1.5 start-0"
                {...attributes}
                {...listeners}
            >
                <GripVertical />
            </div>
        </div>
    );
}
