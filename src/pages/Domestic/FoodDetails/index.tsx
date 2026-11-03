import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ChevronRight,
  Trash2,
  Edit,
  CheckCircle2,
  MinusCircle,
  AlertTriangle,
  Package,
} from "lucide-react";
import Badge from "@/components/Badge";
import { EditFoodModal } from "@/components/Modal";
import type { FoodItemData } from "@/components/Modal/EditFoodModal";
import type { StockMovement, StockProduct } from "@/types/inventory.type";
import { useModalFocus } from "@/hooks/useModalFocus";
import { safeHttpUrl } from "@/utils/url.util";
import { formatUnitOfMeasure } from "@/utils/unit.util";
import { useServiceOperations } from "@/hooks/useServiceOperations";
import type { FoodDetailsContentProps } from "@/types/component-props.type";

const categoryLabels: Record<string, string> = {
  FRUIT: "Frutas",
  VEGETABLE: "Vegetais",
  DAIRY: "Laticínios",
  GRAIN: "Grãos",
  MEAT: "Carnes",
  BEVERAGE: "Bebidas",
  CLEANING: "Limpeza",
  PERSONAL_HYGIENE: "Higiene pessoal",
  FISH: "Peixes",
  FROZEN: "Congelados",
  SWEETS: "Doces",
  CANNED: "Enlatados",
  SEASONING: "Temperos",
};
const categoryValues: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(categoryLabels).map(([value, label]) => [label, value]),
  ),
  Mercearia: "GRAIN",
};
const locationLabels: Record<string, FoodItemData["location"]> = {
  PANTRY: "Despensa",
  CABINET: "Despensa",
  SHELF: "Despensa",
  FRIDGE: "Geladeira",
  FREEZER: "Freezer",
};
const locationValues: Record<FoodItemData["location"], string> = {
  Despensa: "PANTRY",
  Geladeira: "FRIDGE",
  Freezer: "FREEZER",
};
function toFoodItem(row: StockProduct): FoodItemData {
  return {
    id: String(row.id),
    name: row.product?.name ?? `Produto ${row.productId}`,
    category:
      categoryLabels[row.product?.category ?? row.category] ??
      row.product?.category ??
      row.category,
    location:
      locationLabels[row.product?.storagePlace ?? "PANTRY"] ?? "Despensa",
    quantity: `${row.quantity} ${formatUnitOfMeasure(row.product?.unitOfMeasure)}`,
    expiration: row.expireDate,
  };
}

export default function FoodDetailsPage() {
  const { id } = useParams<{ id: string }>();
  return <FoodDetailsContent key={id} id={id} />;
}

function FoodDetailsContent({ id }: FoodDetailsContentProps) {
  const apiOperations = useServiceOperations();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const validId = id !== undefined && /^[1-9]\d*$/.test(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(() =>
    ["estoque-editar-geladeira", "estoque-editar-lista-compras"].includes(
      searchParams.get("alias") ?? "",
    ),
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(
    () => searchParams.get("alias") === "estoque-remover-alimento",
  );
  const [food, setFood] = useState<FoodItemData | null>(null);
  const [product, setProduct] = useState<StockProduct | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(validId);
  const [loadError, setLoadError] = useState("");
  const [movementError, setMovementError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const deleteDialogRef = useModalFocus(isDeleteConfirmOpen, () =>
    setIsDeleteConfirmOpen(false),
  );

  useEffect(() => {
    if (!validId || !id) return;
    let active = true;
    const controller = new AbortController();
    apiOperations.inventory.getStockProduct(Number(id), controller.signal)
      .then(async (loadedProduct) => {
        if (!active) return;
        setProduct(loadedProduct);
        setFood(toFoodItem(loadedProduct));
        try {
          const loadedMovements = await apiOperations.inventory.listStockProductMovements(
            Number(id),
            controller.signal,
          );
          if (active) setMovements(loadedMovements);
        } catch (error) {
          if (active)
            setMovementError(
              error instanceof Error
                ? error.message
                : "Não foi possível carregar as movimentações.",
            );
        }
      })
      .catch(
        (error: unknown) =>
          active &&
          setLoadError(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o alimento.",
          ),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
      controller.abort();
    };
  }, [id, validId, apiOperations.inventory]);

  const handleSave = async (updated: FoodItemData) => {
    if (!id || !product) return;
    const quantity = Number(updated.quantity.trim().split(/\s+/)[0]);
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("Informe uma quantidade inteira válida.");
    }
    setSaving(true);
    setActionError("");
    try {
      const saved = await apiOperations.inventory.updateStockProduct(Number(id), {
        name: updated.name.trim(),
        category:
          categoryValues[updated.category] ??
          product.product?.category ??
          product.category,
        storagePlace: locationValues[updated.location],
        quantity,
        expireDate: updated.expiration,
      });
      setProduct(saved);
      setFood(toFoodItem(saved));
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar as alterações.",
      );
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setSaving(true);
    setActionError("");
    try {
      await apiOperations.inventory.deleteStockProduct(Number(id));
      navigate("/stock?alias=estoque", { replace: true });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível remover o alimento.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!validId) {
    return (
      <>
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Identificador do alimento inválido.
        </div>
        <Link
          to="/stock"
          className="mt-4 inline-block text-sm font-semibold text-frigus-primary"
        >
          Voltar ao estoque
        </Link>
      </>
    );
  }

  if (loading)
    return (
      <>
        <LoadingSpinner label="Carregando alimento…" />
      </>
    );
  if (loadError || !food || !product)
    return (
      <>
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {loadError || "Alimento não encontrado."}
        </div>
        <Link
          to="/stock?alias=estoque"
          className="mt-4 inline-block text-sm font-semibold text-frigus-primary"
        >
          Voltar ao estoque
        </Link>
      </>
    );

  const isExpired = product.productStatus === "EXPIRED";
  const isNearExpiration = product.productStatus === "NEAR_EXPIRATION";
  const statusLabel = isExpired
    ? "Vencido"
    : isNearExpiration
      ? "Vence em breve"
      : "Dentro do prazo";

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-400 font-medium mb-1">
              <Link
                to="/stock"
                className="hover:text-frigus-navy dark:hover:text-white transition-colors"
              >
                Meu estoque
              </Link>
              <ChevronRight size={12} />
              <span>{food.location}</span>
              <ChevronRight size={12} />
              <span className="text-frigus-navy dark:text-white font-semibold">
                {food.name}
              </span>
            </div>
            <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-frigus-navy dark:text-white">
              Detalhes do alimento
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-[#343941] text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Excluir</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              aria-expanded={isEditModalOpen}
              aria-haspopup="dialog"
              aria-controls="edit-food-dialog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2552C8] hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Edit size={15} />
              <span>Editar item</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 md:p-8 border border-gray-200/80 dark:border-[#343941] shadow-xs flex flex-col lg:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-2xl bg-blue-50/50 dark:bg-[#252A32] p-2 flex items-center justify-center border border-blue-100/50 dark:border-[#343941] shrink-0">
            {safeHttpUrl(product.product?.imageUrl) ? (
              <img
                src={safeHttpUrl(product.product?.imageUrl)}
                alt={food.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Package
                aria-hidden="true"
                size={42}
                className="text-blue-300 dark:text-neutral-500"
              />
            )}
          </div>

          <div className="w-full min-w-0 space-y-3 flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <Badge variant="info">{food.category}</Badge>
              <Badge
                variant={
                  isExpired
                    ? "danger"
                    : isNearExpiration
                      ? "warning"
                      : "success"
                }
              >
                {statusLabel}
              </Badge>
            </div>
            <h2 className="break-words font-montserrat font-bold text-2xl text-frigus-navy dark:text-white">
              {food.name}
            </h2>
            <p className="text-xs text-gray-400 dark:text-neutral-400 font-medium">
              {product.product?.brand
                ? `Marca: ${product.product.brand} • `
                : ""}
              ID: #{food.id}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-gray-50 dark:bg-[#252A32] rounded-2xl p-3 border border-gray-100 dark:border-[#343941]">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider block">
                  Quantidade Disponível
                </span>
                <span className="font-montserrat font-bold text-lg text-frigus-navy dark:text-white">
                  {food.quantity}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-[#252A32] rounded-2xl p-3 border border-gray-100 dark:border-[#343941]">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider block">
                  Armazenamento
                </span>
                <span className="font-montserrat font-bold text-lg text-frigus-navy dark:text-white">
                  {food.location}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-[#252A32] rounded-2xl p-3 border border-gray-100 dark:border-[#343941] col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-400 uppercase tracking-wider block">
                  Status
                </span>
                <span
                  className={`font-montserrat font-bold text-base ${isExpired ? "text-red-600 dark:text-red-400" : isNearExpiration ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-4">
            <h3 className="font-montserrat font-bold text-frigus-navy dark:text-white text-base">
              Informações do produto
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 dark:text-neutral-400 font-medium block">
                  Espaço na casa
                </span>
                <span className="font-bold text-frigus-navy dark:text-white mt-0.5 block">
                  {food.location}
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-400 font-medium block">
                  Categoria
                </span>
                <span className="font-bold text-frigus-navy dark:text-white mt-0.5 block">
                  {food.category}
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-400 font-medium block">
                  Data de entrada
                </span>
                <span className="font-bold text-frigus-navy dark:text-white mt-0.5 block">
                  Não informado
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-400 font-medium block">
                  Data de validade
                </span>
                <span className="font-bold text-frigus-navy dark:text-white mt-0.5 block">
                  {food.expiration}
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-400 font-medium block">
                  Código de barras
                </span>
                <span className="font-bold text-frigus-navy dark:text-white mt-0.5 block">
                  Não informado
                </span>
              </div>
              <div>
                <span className="text-gray-400 dark:text-neutral-400 font-medium block">
                  Cadastrado por
                </span>
                <span className="font-bold text-frigus-navy dark:text-white mt-0.5 block">
                  Não informado
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-[#343941]">
              <span className="text-xs text-gray-400 dark:text-neutral-400 font-medium block mb-1">
                Observações
              </span>
              <p className="text-xs text-gray-600 dark:text-neutral-300 font-sans leading-relaxed">
                Nenhuma observação cadastrada.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div
              className={`${isExpired ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-950 dark:text-red-100" : isNearExpiration ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-950 dark:text-amber-100" : "bg-emerald-50 dark:bg-[#122C23] border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"} rounded-3xl p-6 border space-y-2`}
            >
              <div className="flex items-center gap-2">
                {isExpired || isNearExpiration ? (
                  <AlertTriangle
                    size={18}
                    className={
                      isExpired
                        ? "text-red-600 dark:text-red-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  />
                ) : (
                  <CheckCircle2
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                )}
                <h4 className="font-montserrat font-bold text-sm">
                  {isExpired
                    ? "Validade vencida"
                    : isNearExpiration
                      ? "Validade próxima"
                      : "Dentro do prazo de validade"}
                </h4>
              </div>
              <p className="text-xs font-sans leading-relaxed">
                Validade informada: {food.expiration}.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1C1E22] rounded-3xl p-6 border border-gray-200/80 dark:border-[#343941] shadow-xs space-y-3">
              <div>
                <h4 className="font-montserrat font-bold text-frigus-navy dark:text-white text-sm">
                  Histórico de consumo
                </h4>
                <p className="text-[11px] text-gray-400 dark:text-neutral-400">
                  Movimentações dos últimos 30 dias
                </p>
              </div>

              {movementError && (
                <p role="alert" className="text-xs text-red-600">
                  {movementError}
                </p>
              )}
              {actionError && (
                <p role="alert" className="text-xs text-red-600">
                  {actionError}
                </p>
              )}
              <div className="space-y-2 pt-1">
                {movements.length === 0 && !movementError && (
                  <p className="py-3 text-xs text-gray-500 dark:text-neutral-400">
                    Nenhuma movimentação registrada.
                  </p>
                )}
                {movements.map((movement) => {
                  const incoming = movement.movementType === "IN";
                  const label = incoming
                    ? "Entrada no estoque"
                    : movement.movementType === "OUT"
                      ? "Consumo ou saída"
                      : "Ajuste de estoque";
                  const Icon = incoming ? CheckCircle2 : MinusCircle;
                  return (
                    <div
                      key={movement.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-xs dark:border-[#343941] dark:bg-[#252A32]"
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          size={15}
                          className={
                            incoming ? "text-emerald-500" : "text-amber-500"
                          }
                        />
                        <div>
                          <p className="font-bold text-frigus-navy dark:text-white">
                            {label}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-neutral-400">
                            {movement.date
                              ? new Date(movement.date).toLocaleString("pt-BR")
                              : "Data não informada"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${incoming ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-neutral-400"}`}
                      >
                        {incoming ? "+" : "−"}
                        {movement.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditFoodModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={food}
        onSave={handleSave}
      />
      {isDeleteConfirmOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          role="presentation"
        >
          <div
            ref={deleteDialogRef}
            tabIndex={-1}
            className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-[#343941] dark:bg-[#1C1E22]"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-food-title"
            aria-describedby="delete-food-description"
          >
            <h2
              id="delete-food-title"
              className="font-montserrat text-lg font-bold text-frigus-navy dark:text-white"
            >
              Remover alimento?
            </h2>
            <p
              id="delete-food-description"
              className="mt-2 text-sm text-gray-600 dark:text-neutral-300"
            >
              “{food.name}” será removido do estoque. Essa ação não pode ser
              desfeita.
            </p>
            {actionError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {actionError}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="min-h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold text-frigus-navy disabled:opacity-60 dark:border-[#343941] dark:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleDelete()}
                className="min-h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Removendo…" : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
