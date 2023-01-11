#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// <https://docs.substrate.io/reference/frame-pallets/>
pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;

#[frame_support::pallet]
pub mod pallet {
	pub use super::*;
	use frame_support::pallet_prelude::*;
	use frame_support::traits::Randomness;
	use frame_support::traits::UnixTime;
	use frame_support::BoundedVec;
	use frame_system::pallet_prelude::*;
	use scale_info::TypeInfo;
	use sp_std::vec::Vec;

	#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo)]
	#[scale_info(skip_type_params(T))]
	pub struct Post<T: Config> {
		pub id: T::Hash,
		pub desc: Vec<u8>,
		pub img: Vec<u8>,
		pub user_id: T::AccountId,
		pub created_date: u64,
	}

	#[pallet::pallet]
	#[pallet::without_storage_info]
	#[pallet::generate_store(pub(super) trait Store)]
	pub struct Pallet<T>(_);

	/// Configure the pallet by specifying the parameters and types on which it depends.
	#[pallet::config]
	pub trait Config: frame_system::Config {
		/// Because this pallet emits events, it depends on the runtime's definition of an event.
		type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
		type TimeProvider: UnixTime;
		type MaxPostOwner: Get<u32>;
		type MaxPostLike: Get<u32>;
		type PostsRandomness: Randomness<Self::Hash, Self::BlockNumber>;
	}

	// The pallet's runtime storage items.
	// https://docs.substrate.io/main-docs/build/runtime-storage/
	#[pallet::storage]
	#[pallet::getter(fn something)]
	// Learn more about declaring storage items:
	// https://docs.substrate.io/main-docs/build/runtime-storage/#declaring-storage-items
	pub type Something<T> = StorageValue<_, u32>;

	#[pallet::storage]
	#[pallet::getter(fn posts)]
	pub type Posts<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, Post<T>, OptionQuery>;

	#[pallet::storage]
	#[pallet::getter(fn posts_owner)]
	pub(super) type PostsOwner<T: Config> = StorageMap<
		_,
		Blake2_128Concat,
		T::AccountId,
		BoundedVec<T::Hash, T::MaxPostOwner>,
		ValueQuery,
	>;

	#[pallet::storage]
	#[pallet::getter(fn post_likes)]
	pub(super) type PostLikes<T: Config> =
		StorageMap<_, Blake2_128Concat, T::Hash, Vec<T::AccountId>, ValueQuery>;

	// Pallets use events to inform users when important changes are made.
	// https://docs.substrate.io/main-docs/build/events-errors/
	#[pallet::event]
	#[pallet::generate_deposit(pub(super) fn deposit_event)]
	pub enum Event<T: Config> {
		/// Event documentation should end with an array that provides descriptive names for event
		/// parameters. [something, who]
		SomethingStored {
			something: u32,
			who: T::AccountId,
		},
		CreatedPost {
			id: T::Hash,
			user_id: T::AccountId,
		},
		LikedPost {
			id: T::Hash,
			user_id: T::AccountId,
		},
	}

	// Errors inform users that something went wrong.
	#[pallet::error]
	pub enum Error<T> {
		/// Error names should be descriptive.
		NoneValue,
		/// Errors should have helpful documentation associated with them.
		StorageOverflow,
		DuplicatePostId,
		TooManyPost,
		TooManyLike,
		PostNotExist,
	}

	// Dispatchable functions allows users to interact with the pallet and invoke state changes.
	// These functions materialize as "extrinsics", which are often compared to transactions.
	// Dispatchable functions must be annotated with a weight and must return a DispatchResult.
	#[pallet::call]
	impl<T: Config> Pallet<T> {
		#[pallet::weight(0)]
		pub fn create_post(origin: OriginFor<T>, desc: Vec<u8>, img: Vec<u8>) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let owner = ensure_signed(origin)?;
			let id = Self::gen_post_id();
			let time: u64 = T::TimeProvider::now().as_secs();
			let post = Post::<T> { id, desc, img, user_id: owner.clone(), created_date: time };

			// Check if the post does not already exist in our storage map
			ensure!(!Posts::<T>::contains_key(&post.id), Error::<T>::DuplicatePostId);

			// Append post_id to PostsOwner
			<PostsOwner<T>>::try_mutate(&owner, |list_post| list_post.try_push(id.clone()))
				.map_err(|_| <Error<T>>::TooManyPost)?;
			// KittiesOwned::<T>::append(&owner, kitty.dna.clone());

			// Write new kitty to storage
			Posts::<T>::insert(post.id.clone(), post);

			// Deposit our "Created" event.
			Self::deposit_event(Event::CreatedPost { id: id.clone(), user_id: owner.clone() });

			Ok(())
		}

		#[pallet::weight(0)]
		pub fn like_post(origin: OriginFor<T>, post_id: T::Hash) -> DispatchResult {
			// Make sure the caller is from a signed origin
			let owner = ensure_signed(origin)?;
			// Check if the post does not already exist in our storage map
			//ensure!(!Posts::<T>::contains_key(&post_id), Error::<T>::PostNotExist);
			if !PostLikes::<T>::contains_key(&post_id) {
				PostLikes::<T>::append(&post_id, &owner);
			} else {
				let mut vec_user_liked = PostLikes::<T>::get(&post_id);
				if vec_user_liked.contains(&owner) {
					let index = vec_user_liked.iter().position(|x| *x == owner).unwrap();
					vec_user_liked.remove(index);
					PostLikes::<T>::insert(&post_id, vec_user_liked);
				} else {
					vec_user_liked.push(owner.clone());
					PostLikes::<T>::insert(&post_id, vec_user_liked);
				}
			}

			// Deposit our "Created" event.
			Self::deposit_event(Event::LikedPost { id: post_id, user_id: owner });

			Ok(())
		}
	}
	impl<T: Config> Pallet<T> {
		fn gen_post_id() -> T::Hash {
			// Get random kitty_dna make sure it not exists
			let mut random = T::PostsRandomness::random(&b"dna"[..]).0;
			while Self::posts(&random) != None {
				random = T::PostsRandomness::random(&b"dna"[..]).0;
			}
			return random;
		}
	}
}
