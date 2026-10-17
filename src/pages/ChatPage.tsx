/* eslint-disable react-hooks/set-state-in-effect -- These effects load async API data into view state. */
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Paperclip, Search, Send, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar/Navbar";
import { useStore } from "@/store/store";
import { chatService } from "@/services/chat.service";
import { groupService } from "@/services/group.service";
import type { z } from "zod";
import { conversationSchema, groupSchema, messageReactionSchema } from "@/schemas/api.schema";

type Conversation = z.output<typeof conversationSchema>;
type Group = z.output<typeof groupSchema>;
type Reaction = z.output<typeof messageReactionSchema>;
const emojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function ChatPage() {
  const user = useStore((s) => s.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState<Awaited<ReturnType<typeof chatService.listMessages>>["content"]>([]);
  const [reactions, setReactions] = useState<Record<number, Reaction[]>>({});
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupToOpen, setGroupToOpen] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [privateTargetId, setPrivateTargetId] = useState("");

  const current = conversations.find((conversation) => conversation.id === conversationId);
  const activeGroups = useMemo(() => groups.filter((group) => group.members.some((member) => member.userId === user?.id)), [groups, user?.id]);

  async function loadConversations() {
    const [conversationItems, groupItems] = await Promise.all([chatService.list(), groupService.list()]);
    setConversations(conversationItems);
    setGroups(groupItems);
    if (!conversationId && conversationItems.length) setConversationId(conversationItems[0].id);
  }
  async function loadMessages(id: string, query = search) {
    const page = await chatService.listMessages(id, { page: 0, size: 50 }, query);
    setMessages([...page.content].reverse());
    const reactionsById = await Promise.all(page.content.map(async (message) => [message.id, await chatService.listReactions(id, message.id)] as const));
    setReactions(Object.fromEntries(reactionsById));
  }

  useEffect(() => { loadConversations().catch((cause) => setError(cause instanceof Error ? cause.message : "Não foi possível carregar as conversas.")); }, []);
  useEffect(() => { if (conversationId) loadMessages(conversationId).catch((cause) => setError(cause instanceof Error ? cause.message : "Não foi possível carregar as mensagens.")); }, [conversationId]);

  if (!user) return <Navigate to="/login" replace />;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!conversationId || (!draft.trim() && !files.length)) return;
    setLoading(true); setError("");
    try {
      const attachments = files.length ? await Promise.all(files.map((file) => chatService.uploadAttachment(conversationId, file))) : undefined;
      await chatService.sendMessage(conversationId, { content: draft.trim() || (files.length ? `Anexos: ${files.map((file) => file.name).join(", ")}` : undefined), messageType: attachments?.length ? "IMAGE" : "TEXT", attachments });
      setDraft(""); setFiles([]); if (fileRef.current) fileRef.current.value = "";
      await loadMessages(conversationId);
      await loadConversations();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível enviar a mensagem."); }
    finally { setLoading(false); }
  }

  async function openGroup(event: FormEvent) {
    event.preventDefault();
    const group = activeGroups.find((item) => item.id === groupToOpen);
    if (!group) return;
    setLoading(true); setError("");
    try {
      const conversation = await chatService.createGroup({ groupId: group.id, name: group.name, participantUserIds: group.members.map((member) => member.userId) });
      await loadConversations(); setConversationId(conversation.id);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível abrir o grupo."); }
    finally { setLoading(false); }
  }

  async function toggleReaction(messageId: number, emoji: string) {
    if (!conversationId || !user) return;
    try {
      const existing = reactions[messageId] ?? [];
      const hasReacted = existing.some((reaction) => reaction.userId === user.id && reaction.emoji === emoji);
      const updated = hasReacted ? await chatService.removeReaction(conversationId, messageId, emoji) : await chatService.addReaction(conversationId, messageId, emoji);
      setReactions((state) => ({ ...state, [messageId]: updated }));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível atualizar a reação."); }
  }

  async function searchMessages(event: FormEvent) {
    event.preventDefault(); if (!conversationId) return;
    try { await loadMessages(conversationId, search); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Falha na busca de mensagens."); }
  }

  async function openPrivate(event: FormEvent) {
    event.preventDefault(); if (!privateTargetId) return;
    try { const conversation = await chatService.createPrivate(privateTargetId); await loadConversations(); setConversationId(conversation.id); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível abrir a conversa privada."); }
  }

  return <div className="min-h-screen bg-[#F6F8FC] text-frigus-navy md:flex"><Sidebar activeSection="chat" />
    <main className="min-w-0 flex-1 p-5 md:p-8">
      <header className="mb-6"><p className="text-sm font-semibold text-frigus-primary">Comunicação</p><h1 className="mt-1 text-3xl font-bold">Chat</h1><p className="mt-2 text-sm text-slate-500">Converse com os membros dos seus grupos, pesquise mensagens e compartilhe arquivos.</p></header>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <section className="grid min-h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r">
          <form onSubmit={openGroup} className="mb-5 rounded-xl bg-slate-50 p-3">
            <label className="mb-2 block text-xs font-semibold text-slate-600">Iniciar conversa de grupo</label>
            <div className="flex gap-2"><select className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm" value={groupToOpen} onChange={(event) => setGroupToOpen(event.target.value)}><option value="">Escolha um grupo</option>{activeGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select><button className="rounded-lg bg-frigus-primary px-3 text-white" disabled={!groupToOpen || loading} aria-label="Abrir grupo"><Users size={18} /></button></div>
          </form>
          <form onSubmit={openPrivate} className="mb-5 rounded-xl bg-slate-50 p-3"><label className="mb-2 block text-xs font-semibold text-slate-600">Conversa privada</label><div className="flex gap-2"><select value={privateTargetId} onChange={e=>setPrivateTargetId(e.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"><option value="">Membro do grupo</option>{activeGroups.flatMap(group=>group.members.filter(member=>member.userId!==user.id).map(member=><option key={`${group.id}-${member.userId}`} value={member.userId}>{member.name} · {group.name}</option>))}</select><button disabled={!privateTargetId} className="rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold">Abrir</button></div></form>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Conversas</h2>
          <div className="space-y-1">{conversations.map((conversation) => <button key={conversation.id} onClick={() => { setSearch(""); setConversationId(conversation.id); }} className={`w-full rounded-xl px-3 py-3 text-left ${conversation.id === conversationId ? "bg-blue-50 text-frigus-primary" : "hover:bg-slate-50"}`}><span className="block truncate text-sm font-semibold">{conversation.name || conversation.groupName || conversation.participants.map((p) => p.name).filter((name) => name !== user.name).join(", ") || "Conversa"}</span><span className="mt-1 block truncate text-xs text-slate-500">{conversation.latestMessage?.content || "Sem mensagens"}</span></button>)}{!conversations.length && <p className="py-4 text-sm text-slate-500">Nenhuma conversa. Escolha um grupo acima para começar.</p>}</div>
        </aside>
        <div className="flex min-h-[65vh] min-w-0 flex-col">
          {current ? <>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold">{current.name || current.groupName || "Conversa privada"}</h2><p className="text-xs text-slate-500">{current.participants.length} participantes</p></div><form onSubmit={searchMessages} className="flex max-w-sm items-center gap-2"><Search size={16} className="text-slate-400"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar mensagens" className="w-full min-w-0 border-b border-slate-200 py-2 text-sm outline-none focus:border-frigus-primary"/><button className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">Buscar</button>{search && <button type="button" onClick={() => {setSearch(""); void loadMessages(conversationId, "");}} className="text-xs text-frigus-primary">Limpar</button>}</form></div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message) => { const isMine = message.senderId === user.id; const messageReactions = reactions[message.id] ?? []; return <article key={message.id} className={`max-w-[85%] rounded-2xl p-3 ${isMine ? "ml-auto bg-blue-50" : "bg-slate-50"}`}><div className="mb-1 flex items-center justify-between gap-4"><span className="text-xs font-bold">{isMine ? "Você" : message.senderName}</span><time className="text-[10px] text-slate-400">{new Date(message.createdAt).toLocaleString("pt-BR")}</time></div>{message.content && <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>}{message.attachments?.map((attachment) => attachment.mimeType.startsWith("image/") ? <a key={attachment.id} href={attachment.fileUrl} target="_blank" rel="noreferrer"><img src={attachment.fileUrl} alt={attachment.fileName} className="mt-2 max-h-72 rounded-lg object-contain" /></a> : <a key={attachment.id} href={attachment.fileUrl} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-semibold text-frigus-primary underline">📎 {attachment.fileName}</a>)}<div className="mt-2 flex flex-wrap items-center gap-1"><div className="flex gap-0.5">{emojis.map((emoji) => <button key={emoji} onClick={() => void toggleReaction(message.id, emoji)} className="rounded px-1.5 py-1 text-sm hover:bg-white" title={`Reagir com ${emoji}`}>{emoji}</button>)}</div>{Object.entries(messageReactions.reduce<Record<string, { count: number; mine: boolean }>>((acc, reaction) => { const value = acc[reaction.emoji] ?? { count: 0, mine: false }; value.count += 1; value.mine ||= reaction.userId === user.id; acc[reaction.emoji] = value; return acc; }, {})).map(([emoji, value]) => <button key={emoji} onClick={() => void toggleReaction(message.id, emoji)} className={`rounded-full border px-2 py-0.5 text-xs ${value.mine ? "border-blue-300 bg-blue-100" : "border-slate-200 bg-white"}`}>{emoji} {value.count}</button>)}</div></article>; })}{!messages.length && <p className="py-10 text-center text-sm text-slate-400">{search ? "Nenhuma mensagem encontrada." : "Ainda não há mensagens nesta conversa."}</p>}</div>
            <form onSubmit={submit} className="border-t border-slate-100 p-4"><div className="flex items-end gap-2"><input ref={fileRef} type="file" multiple accept="image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={(event) => {const selected=Array.from(event.target.files??[]);if(selected.length>5)setError("Envie até 5 arquivos por mensagem.");else {setFiles(selected);setError("");}}} /><button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50" aria-label="Anexar arquivo"><Paperclip size={18} /></button><div className="min-w-0 flex-1"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} placeholder="Escreva uma mensagem..." className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-frigus-primary" />{files.map(file=><p key={`${file.name}-${file.size}`} className="mt-1 truncate text-xs text-slate-500">📎 {file.name} <button type="button" onClick={() => setFiles(current=>current.filter(item=>item!==file))} className="text-red-600">Remover</button></p>)}</div><button disabled={loading || (!draft.trim() && !files.length)} className="rounded-xl bg-frigus-primary p-3 text-white disabled:opacity-50" aria-label="Enviar"><Send size={18} /></button></div><p className="mt-2 pl-12 text-[11px] text-slate-400">Até 5 imagens/PDF por mensagem, máximo de 10 MB por arquivo. Os anexos são privados e os links temporários duram 24 horas.</p></form>
          </> : <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">Selecione ou inicie uma conversa.</div>}
        </div>
      </section>
    </main>
  </div>;
}
