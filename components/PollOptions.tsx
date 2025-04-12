export default function PollOptions() {
    return (
        <>
            <Label>Options</Label>
            {options.map((option, index) => (
                <div key={index} className="relative">
                    <Label
                        htmlFor={`option-${index}`}
                        className="sr-only"
                    >{`option-${index}`}</Label>
                    <Input
                        id={`option-${index}`}
                        name="option"
                        value={option.optionText}
                        onChange={(e) =>
                            handleOptionTextChange(e.target.value, index)
                        }
                        className="pl-6"
                    />
                    <GripVertical className="absolute inset-y-0 start-0" />
                </div>
            ))}

            <Button onClick={addOption} type="button" size="icon">
                <Plus className="size-4 text-white" />
            </Button>
        </>
    );
}