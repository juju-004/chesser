import { SessionContext } from "@/context/session";
import { IconCoin, IconPalette } from "@tabler/icons-react";
import {
  IconArrowCapsule,
  IconAt,
  IconCashBanknote,
  IconHome2,
  IconUsers
} from "@tabler/icons-react";
import React, { useContext } from "react";

function Menu() {
  const session = useContext(SessionContext);

  const items = [
    {
      text: "Home",
      icon: <IconHome2 className="size-4" />,
      color: "bg-fuchsia-600"
    },
    {
      text: "Players",
      icon: <IconAt className="size-4" />,
      color: "bg-green-600"
    },
    {
      text: "Friends",
      icon: <IconUsers className="size-4" />,
      color: "bg-cyan-600"
    },
    {
      text: "Theme",
      icon: <IconPalette className="size-4" />,
      color: "bg-red-600"
    }
  ];

  const paymentItems = [
    {
      text: "Deposit",
      icon: <IconCashBanknote className="size-4" />
    },
    {
      text: "Withdraw",
      icon: <IconCoin className="size-4" />
    },
    {
      text: "Transaction History",
      icon: <IconArrowCapsule className="size-4" />
    }
  ];

  const customerItems = [
    {
      text: "Make Complaint"
    },
    {
      text: "Support"
    },
    {
      text: "Terms & conditions"
    }
  ];

  return (
    <div className="flex h-screen flex-col">
      <div className="bg-gradient-to-b from-gray-900 to-transparent px-5 pb-1 pt-5">
        <h3 className="ml-3 text-lg">{session?.user?.name}</h3>
        <div className="bg-base-100 mb-4 flex w-full items-center gap-2 rounded-3xl px-2 py-1">
          <span className="fx bg-base-300 size-5 rounded-full"> {session?.user?.email[0]}</span>
          <span className="w-[70%] flex-1 overflow-hidden text-ellipsis text-sm text-white/80">
            {session?.user?.email}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-x-hidden overflow-y-scroll">
        <ul className="menu w-full gap-4 px-5">
          {items.map((item, key) => (
            <li className="" key={key}>
              <a className="">
                <span className={`size-6 rotate-6 rounded-lg px-1.5 ${item.color}`}>
                  {item.icon}
                </span>
                {item.text}{" "}
              </a>
            </li>
          ))}
          <li>
            <details open>
              <summary className="opacity-40">Payment</summary>
              <ul>
                {paymentItems.map((item, key) => (
                  <li className="" key={key}>
                    <a className="">
                      <span
                        className={`bg-base-100 size-6 rotate-6 rounded-lg px-1.5 text-white/70`}
                      >
                        {item.icon}
                      </span>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          <li>
            <details open>
              <summary className="opacity-40">Customer</summary>
              <ul>
                {customerItems.map((item, key) => (
                  <li className="" key={key}>
                    <a className="">{item.text}</a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="py-1.5 text-center text-sm opacity-25">&copy;2025 Chesser</div>
    </div>
  );
}

export default Menu;
