export default function AvatarGroup() {
    const avatars = [
        { id: 1, src: "/profiles/1.webp", alt: "Avatar" },
        { id: 2, src: "/profiles/2.webp", alt: "Avatar" },
        { id: 3, src: "/profiles/3.webp", alt: "Avatar" },
        { id: 4, src: "/profiles/4.webp", alt: "Avatar" },
        { id: 5, src: "/profiles/5.webp", alt: "Avatar" }
    ];

    return (
        <>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 py-4 sm:py-6 px-2">
            <div className="avatar-group -space-x-4 sm:-space-x-6 justify-center sm:justify-start">
            {avatars.map((avatar) => (
                <div key={avatar.id} className="avatar">
                    <div className="w-8 sm:w-10">
                        <img src={avatar.src} alt={avatar.alt} />
                    </div>
                </div>
            ))}
        </div>

        <div className="flex flex-col gap-1 text-center sm:text-left">
            <div className="rating rating-sm justify-center sm:justify-start">
                <div className="mask mask-star-2 bg-orange-400" aria-label="1 star"></div>
                <div className="mask mask-star-2 bg-orange-400" aria-label="2 star"></div>
                <div className="mask mask-star-2 bg-orange-400" aria-label="3 star" ></div>
                <div className="mask mask-star-2 bg-orange-400" aria-label="4 star"></div>
                <div className="mask mask-star-2 bg-orange-400" aria-label="5 star"aria-current="true"></div>
            </div>
            <span className="text-sm sm:text-base">Makers build what <span className="font-bold">users want</span></span>
        </div>
        </div>
        </>
    );
}