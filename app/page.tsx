import ExampleMap from "./ExampleMap";

export default function Home() {
  return (
    <section className="h-screen w-screen">
      <div className="h-full w-full flex flex-row ">
        <div className="h-full w-1/2 flex flex-col items-center justify-center">
          <ul>
            <li>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis hic
              excepturi sapiente earum est magni cum quae eum iure ab.
            </li>
            <li>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Doloremque atque consectetur repudiandae ratione fugiat, non natus
              sed quae eaque molestias!
            </li>
            <li>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              officiis aliquam cupiditate magni neque consequatur blanditiis
              iusto assumenda nihil? Magnam!
            </li>
            <li>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Accusantium non ratione adipisci facere enim voluptatibus
              cupiditate minus commodi modi eum?
            </li>
          </ul>
        </div>
        <div className="h-full w-1/2 flex flex-col items-center justify-center">
          <div className="h-1/2 w-5/6">
            <ExampleMap />
          </div>
        </div>
      </div>
    </section>
  );
}
