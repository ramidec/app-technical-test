import { useQuery } from "@tanstack/react-query";
import { CHANNEL_ID } from "@/constants/channels";

const MOCK_CONTACT = {
  contactName: "Jessie Doe",
  contactFirstName: "Jessie",
  contactOrg: "NextGen Dynamics",
};

export function useContact() {
  const { data } = useQuery({
    queryKey: ["contact", CHANNEL_ID],
    queryFn: () => MOCK_CONTACT,
    initialData: MOCK_CONTACT,
  });

  return data;
}
