import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { StorageLocation, Bin } from "@/src/lib/types"; // Import types
import { StorageLocationForm } from "./storage-location-form";
import { BinForm } from "./bin-form";
import { Button } from "./ui/button";
import { X } from "lucide-react"; // Import X icon

const Spinner = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

interface ManageStorageProps {
  user: User;
}

export function ManageStorage({ user }: ManageStorageProps) {
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>(
    []
  );
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<StorageLocation | null>(null);

  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [isLoadingBins, setIsLoadingBins] = useState(false);

  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showBinForm, setShowBinForm] = useState(false);

  // TODO: states for editing
  // const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);
  // const [editingBin, setEditingBin] = useState<Bin | null>(null);

  const fetchStorageLocations = useCallback(async () => {
    setIsLoadingLocations(true);
    try {
      const { data, error } = await supabase
        .from("storage_locations")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching storage locations:", error);
        throw error;
      }

      setStorageLocations(data || []);
    } catch (error) {
      console.error("Caught an error in fetchStorageLocations:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  }, [user.id]);

  const handleDeleteLocation = async (
    locationId: string,
    locationName: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete the location "${locationName}" and all child bins? This action cannot be undone.`
      )
    ) {
      try {
        if (selectedLocation?.id === locationId) {
          setSelectedLocation(null);
        }

        //TODO: orphan wines in deleted bins

        let { error: binsDeleteError } = await supabase
          .from("bins")
          .delete()
          .eq("storage_location_id", locationId);
        if (binsDeleteError) {
          console.error("Error deleting associated bins:", binsDeleteError);
          // TODO: Show user-facing error message
          throw binsDeleteError;
        }

        const { error: locationDeleteError } = await supabase
          .from("storage_locations")
          .delete()
          .eq("id", locationId);

        if (locationDeleteError) {
          console.error(
            "Error deleting storage location:",
            locationDeleteError
          );
          // TODO: Show user-facing error message
          throw locationDeleteError;
        }

        fetchStorageLocations();
      } catch (error) {
        console.error(
          "Failed to delete storage location and/or its bins:",
          error
        );
      }
    }
  };

  const fetchBins = useCallback(
    async (locationId?: string) => {
      const locationIds = storageLocations.map((sl) => sl.id);
      if (!locationId && locationIds.length === 0) {
        console.log(
          "Skipping fetchBins as no locationId is provided and storageLocations is empty."
        );
        setBins([]);
        return;
      }

      setIsLoadingBins(true);
      try {
        let query = supabase
          .from("bins")
          .select(
            "id, name, storage_location_id, storage_location:storage_locations(name)"
          );

        if (locationId) {
          query = query.eq("storage_location_id", locationId); //fetch single bin
        } else {
          query = query.in("storage_location_id", locationIds); //fetch all bins
        }

        const { data, error } = await query;

        if (error) throw error;

        const transformedBins = (data || []).map((bin) => {
          let finalStorageLocation = null;
          if (bin.storage_location) {
            if (Array.isArray(bin.storage_location)) {
              //using storage_location:storage_locations(name) in the query is always returned as an Array by the supabase js client :-\
              // If it's an array, take the first element if it exists, otherwise null
              finalStorageLocation =
                bin.storage_location.length > 0
                  ? bin.storage_location[0]
                  : null;
            } else {
              // If it's not an array, it should be an object (or null handled by initial value)
              finalStorageLocation = bin.storage_location;
            }
          }
          return {
            ...bin,
            storage_location: finalStorageLocation,
          };
        });

        setBins(transformedBins);
      } catch (error) {
        console.error("Error fetching bins:", error);
      } finally {
        setIsLoadingBins(false);
      }
    },
    [user.id, storageLocations]
  );

  useEffect(() => {
    fetchStorageLocations();
  }, [fetchStorageLocations]);

  useEffect(() => {
    if (storageLocations.length > 0) {
      fetchBins();
    } else {
      setBins([]);
    }
  }, [storageLocations, fetchBins]);

  const handleLocationSuccess = () => {
    fetchStorageLocations();
    setShowLocationForm(false);
  };

  const handleBinSuccess = () => {
    fetchBins();
    setShowBinForm(false);
  };

  const filteredBins = selectedLocation
    ? bins.filter((bin) => bin.storage_location_id === selectedLocation.id)
    : bins;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Manage Storage</h1>
      </div>

      {/* Storage Locations Section */}
      <section className="space-y-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Storage Locations</h2>
          <Button
            onClick={() => {
              //setEditingLocation(null);  //TODO: Edit
              setShowLocationForm(true);
            }}
          >
            Add Location
          </Button>
        </div>

        {showLocationForm && (
          <StorageLocationForm
            loggedInUser={{ id: user.id }}
            onSuccess={handleLocationSuccess}
            // storageLocationToEdit={editingLocation} //TODO: Edit
          />
        )}

        {isLoadingLocations ? (
          <Spinner />
        ) : storageLocations.length === 0 ? (
          <p>No storage locations found. Add one to get started.</p>
        ) : (
          <ul className="space-y-2">
            {storageLocations.map((location) => (
              <li
                key={location.id}
                className={`flex items-center justify-between p-3 rounded-md border ${
                  selectedLocation?.id === location.id
                    ? "bg-muted border-primary"
                    : "hover:bg-accent"
                }`}
              >
                <span
                  className="flex-grow cursor-pointer"
                  onClick={() => setSelectedLocation(location)}
                >
                  {location.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent li's onClick from firing
                    handleDeleteLocation(location.id, location.name);
                  }}
                  aria-label={`Delete ${location.name}`}
                >
                  <X size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Bins Section */}
      <section className="space-y-4 p-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Bins {selectedLocation ? `in ${selectedLocation.name}` : "(All)"}
          </h2>
          <Button
            onClick={() => {
              //setEditingBin(null); //TODO: Edit
              setShowBinForm(true);
            }}
            disabled={!selectedLocation && storageLocations.length > 0}
          >
            Add Bin
          </Button>
        </div>
        {showBinForm &&
          selectedLocation && (
            <BinForm
              loggedInUserId={user.id}
              onSuccess={handleBinSuccess}
              storageLocationId={selectedLocation.id}
              // binToEdit={editingBin} //TODO: Edit
            />
          )}
        {showBinForm && !selectedLocation && storageLocations.length > 0 && (
          <p className="text-sm text-destructive">
            Please select a storage location first to add a bin.
          </p>
        )}

        {isLoadingBins ? (
          <Spinner />
        ) : filteredBins.length === 0 ? (
          selectedLocation ? (
            <p>No bins found in this location. Add one!</p>
          ) : (
            <p>Select a location to see its bins, or add a location first.</p>
          )
        ) : (
          <ul className="space-y-2">
            {filteredBins.map((bin) => (
              <li
                key={bin.id}
                className="p-3 rounded-md border hover:bg-accent"
              >
                {bin.name}
                {/* TODO: Edit */}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
