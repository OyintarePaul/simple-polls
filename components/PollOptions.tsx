import { GripVertical, Plus, X } from "lucide-react";
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
    handleRemove: (index: number) => void;
}

export default function PollOptions({
    options,
    handleOptionTextChange,
    addOption,
    updateOptions,
    handleRemove,
}: PollOptionsProps) {
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oldIndex = +active.id;
            const newIndex = +over.id;
            updateOptions(arrayMove(options, oldIndex, newIndex));
        }
    };

    return (
        <div className="space-y-4">
            <Label>Options</Label>
            <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={options.map((_, index) => index)}>
                    {options.map((option, index) => (
                        <Option
                            option={option}
                            index={index}
                            handleOptionTextChange={handleOptionTextChange}
                            key={index}
                            handleRemove={handleRemove}
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
    handleRemove: (index: number) => void;
    handleOptionTextChange: (text: string, currentIndex: number) => void;
}

function Option({
    option,
    index,
    handleOptionTextChange,
    handleRemove,
}: OptionProps) {
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
                className="px-6"
            />
            <Button
                className="absolute inset-y-2.5 start-0 size-4 hover:bg-transparent"
                {...attributes}
                {...listeners}
                variant="ghost"
                type="button"
            >
                <GripVertical />
            </Button>
            <div className="absolute inset-y-3 end-6">
                <RemoveOption handleRemove={handleRemove} index={index} />
            </div>
        </div>
    );
}

interface RemoveProps {
    handleRemove: (index: number) => void;
    index: number;
}

function RemoveOption({ handleRemove, index }: RemoveProps) {
    return (
        <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute size-4"
            onClick={(e) => handleRemove(index)}
        >
            <X className="text-destructive" />
        </Button>
    );
}
