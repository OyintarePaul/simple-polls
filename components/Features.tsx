import { ChartArea, ExternalLink,  Plus,  Code } from "lucide-react";
const feature = [
  {
    title: "Create",
    description:
      "Simply type your question, add your options, upload your media and you're ready to go in minutes – no technical skills required.",
    icon: <Plus className="size-6" />,
  },
  {
    title: "Share",
    description:
      "Generate a unique, shareable link for every poll and effortlessly distribute it via social media, email or anywhere else you connect with people. ",
    icon: <ExternalLink className="size-6" />,
  },
  {
    title: "Results",
    description:
      "Watch votes come in live and gain instant insights with easy-to-understand charts and graphs, allowing for immediate analysis and quick decision-making.",
    icon: <ChartArea className="size-6" />,
  },
  {
    title: "Integrate",
    description:
      "Seamlessly embed your polls directly into your website, blog posts, or online communities. Simply grab the provided code snippet and paste it where you need it. ",
    icon: <Code className="size-6" />,
  },
];

export default function Features() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:max-w-3xl md:text-center">
            <p className="text-sm text-muted-foreground">WHY WE ARE UNIQUE</p>
            <h2 className="text-3xl font-medium md:text-5xl">
            Unlock the Power of Simple Polling.
            </h2>

            <p className="text-muted-foreground md:max-w-2xl">
            We've built SimplePolls with you in mind. Our core features are designed for a seamless and intuitive experience, allowing you to create and manage polls with ease, no matter your technical expertise
            </p>
          </div>
        </div>
        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
          {feature.map((feature, index) => (
            <div
              className="flex flex-col justify-between rounded-lg bg-accent p-6 md:min-h-[300px] md:p-8"
              key={index}
            >
              <span className="mb-6 flex size-11 items-center justify-center rounded-full bg-background">
                {feature.icon}
              </span>
              <div>
                <h3 className="text-lg font-medium md:text-2xl">
                  {feature.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
